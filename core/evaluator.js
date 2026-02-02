export async function evaluate(ast, env) {
	switch (ast.type) {
		case 'Program':
			// Evaluate each statement
			for (const statement of ast.body) {
				await evaluate(statement, env);
			}
			process.exit(0);
		case 'NumberLiteral':
		case 'StringLiteral':
			return ast.value;
		case 'Identifier':
			return env[ast.name];
		case 'VariableDeclaration':
			return (env[ast.name] = await evaluate(ast.value, env));
		case 'CallExpression':
			// Evaluate the callee
			const callee = await evaluate(ast.callee, env);
			const args = await Promise.all(
				ast.arguments.map(async (arg) => await evaluate(arg, env))
			);

			return await callee(...args);
	}
}
