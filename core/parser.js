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

		if (token.type === 'identifier') {
			current++;

			return {
				type: 'Identifier',
				value: token.value,
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

			if (token.type === 'paren' && token.value === ')') {
				return node;
			}
		}

		throw new TypeError('Unexpected token: ' + JSON.stringify(token));
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
		if (node) console.log(node);

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
