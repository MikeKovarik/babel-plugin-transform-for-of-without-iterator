module.exports = function({template, types: t}) {

	let arrayifyTemplate = template(`
		let ARRAY = INPUT
		if (!Array.isArray(ARRAY)) {
			if (typeof ARRAY.entries === 'function')
				ARRAY = ARRAY.entries();
			ARRAY = Array.from(ARRAY);
		}
	`)

	let buildForOfArray = template(`
		for (var KEY = 0; KEY < ARRAY.length; KEY++) BODY
	`)

	return {

		visitor: {

			ForOfStatement(path) {
				let {node, scope} = path
				let {left, right, body} = node

				// Wrap right side after "of" statement, wrap it with Array.from and assign
				// it to property of name arrayifiedKey.
				let arrayifiedKey = scope.generateUidIdentifier('arrayified')
				let arrayify = arrayifyTemplate({
					ARRAY: arrayifiedKey,
					INPUT: right
				})

				let iterationKey = scope.generateUidIdentifier('i')
				let loop = buildForOfArray({
					BODY: body,
					KEY: iterationKey,
					ARRAY: arrayifiedKey
				})

				t.inherits(loop, node)
				t.ensureBlock(loop)

				let iterationValue = t.memberExpression(arrayifiedKey, iterationKey, true)
				if (t.isVariableDeclaration(left)) {
					left.declarations[0].init = iterationValue
					loop.body.body.unshift(left)
				} else {
					loop.body.body.unshift(t.expressionStatement(t.assignmentExpression('=', left, iterationValue)))
				}

				if (path.parentPath.isLabeledStatement()) {
					loop = t.labeledStatement(path.parentPath.node.label, loop)
				}

				path.replaceWithMultiple([...arrayify, loop])
			}
		}
	}
}