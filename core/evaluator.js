export async function evaluate(ast, env) {
	switch (ast.type) {
		case 'Program':
			// Evaluate each statement
			for (const statement of ast.body) {
				await evaluate(statement, env);
			}
		case 'NumberLiteral':
		case 'StringLiteral':
			return ast.value;
		case 'Identifier':
			return env[ast.name];
		case 'VariableDeclaration':
			return (env[ast.name] = await evaluate(ast.value, env));
		case 'IfStatement':
			if (await evaluate(ast.condition, env)) {
				return await evaluate(ast.body, env);
			} else if (ast.alternate) {
				return await evaluate(ast.alternate, env);
			}
			return null;
		case 'WhileStatement':
			while (await evaluate(ast.condition, env)) {
				await evaluate(ast.body, env);
			}
			return null;
		case 'BlockStatement':
			let result = null;
			for (const statement of ast.body) {
				result = await evaluate(statement, env);
			}
			return result;
		case 'CallExpression':
			// Evaluate the callee
			const callee = await evaluate(ast.callee, env);
			const args = await Promise.all(
				ast.arguments.map(async (arg) => await evaluate(arg, env))
			);

			return await callee(...args);
	}
}
