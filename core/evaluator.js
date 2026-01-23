export function evaluate(ast, env) {
	switch (ast.type) {
		case 'Program':
			// Evaluate each statement
			ast.body.forEach((statement) => evaluate(statement, env));
			return null;
		case 'NumberLiteral':
		case 'StringLiteral':
			return ast.value;
		case 'Identifier':
			return env[ast.name];
		case 'VariableDeclaration':
			return (env[ast.name] = evaluate(ast.value, env));
		case 'CallExpression':
			// Evaluate the callee
			let callee = evaluate(ast.callee, env);
			// Evaluate the arguments
			let args = ast.arguments.map((arg) => evaluate(arg, env));
			return callee(...args);
	}
}
