export function parser(tokens) {
	let current = 0;

	function parsePrimary() {
		let token = tokens[current];

		if (token.type === 'number') {
			current++;

			return {
				type: 'NumberLiteral',
				value: token.value,
			};
		}

		if (token.type === 'keyword' && token.value === 'variable') {
			return parseVariable();
		}

		if (token.type === 'identifier') {
			current++;

			return {
				type: 'Identifier',
				name: token.name,
			};
		}

		if (token.type === 'string') {
			current++;

			return {
				type: 'StringLiteral',
				value: token.value,
			};
		}

		if (token.type === 'paren' && token.value === '(') {
			current++;

			let node = parseExpression();
			token = tokens[current];

			// Expect the closing parenthesis
			if (token.type === 'paren' && token.value === ')') {
				return node;
			}

			throw new TypeError('Expected token: )');
		}

		// Throw an error for any unexpected tokens
		throw new TypeError('Unexpected token: ' + JSON.stringify(token));
	}

	function parseVariable() {
		current++;

		// Expect an identifier
		if (tokens[current].type !== 'identifier') {
			throw new TypeError('Expected token: identifier');
		}
		const identifier = tokens[current];

		current++;

		// Expect an equals
		if (tokens[current].type !== 'equals') {
			throw new TypeError('Expected token: =');
		}

		// Skip the equals and get the value
		current++;
		const value = parseExpression();

		return {
			type: 'VariableDeclaration',
			name: identifier.name,
			value: value,
		};
	}

	function parseCallExpression(callee) {
		let args = [];

		// Skip the opening parenthesis
		current++;

		// Parse arguments if call is not immediately closed
		if (tokens[current].type !== 'paren' && tokens[current].value !== ')') {
			// Eats an expression, and checks if there's another
			args.push(parseExpression());

			while (tokens[current].type === 'comma') {
				current++;
				args.push(parseExpression());
			}
		}

		// Expect the closing parenthesis
		if (tokens[current].type !== 'paren' || tokens[current].value !== ')') {
			throw new TypeError('Expected token: )');
		}

		// Skip the closing parenthesis
		current++;

		return {
			type: 'CallExpression',
			callee: callee,
			arguments: args,
		};
	}

	function parseExpression() {
		let node = parsePrimary();

		while (
			tokens[current] &&
			tokens[current].type === 'paren' &&
			tokens[current].value === '('
		) {
			node = parseCallExpression(node);
		}

		return node;
	}

	let ast = {
		type: 'Program',
		body: [],
	};

	while (current < tokens.length) {
		ast.body.push(parseExpression());
	}

	return ast;
}
