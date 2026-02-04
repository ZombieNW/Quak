export function parser(tokens) {
	let current = 0;

	// Helper to look at next token
	const peek = () => tokens[current];

	// Helper to consume a token
	const advance = () => tokens[current++];

	// Helper to detect end
	const isAtEnd = () => current >= tokens.length;

	// Helper to validate a token
	const consume = (type, value, message) => {
		const token = peek();
		if (!token || token.type !== type || (value && token.value !== value)) {
			throw new TypeError(
				message || `Expected ${type} but got ${token?.type}`
			);
		}
		return advance();
	};

	function parseStatement() {
		const token = peek();

		if (token.type === 'keyword') {
			if (token.value === 'if') return parseIfStatement();
			if (token.value === 'variable') return parseVariable();
			if (token.value === 'while') return parseWhileStatement();
		}
		return parseExpression();
	}

	function parseWhileStatement() {
		consume('keyword', 'while');

		// Condition
		consume('paren', '(');
		const condition = parseExpression();
		consume('paren', ')');

		const body = parseBlock();

		return {
			type: 'WhileStatement',
			condition,
			body,
		};
	}

	function parsePrimary() {
		const token = peek();

		if (token.type === 'number') {
			advance();
			return {
				type: 'NumberLiteral',
				value: token.value,
			};
		}

		if (token.type === 'string') {
			advance();
			return {
				type: 'StringLiteral',
				value: token.value,
			};
		}

		if (token.type === 'identifier') {
			advance();
			return {
				type: 'Identifier',
				name: token.name,
			};
		}

		if (token.type === 'boolean') {
			advance();
			return {
				type: 'BooleanLiteral',
				value: token.value,
			};
		}

		if (token.type === 'paren' && token.value === '(') {
			advance(); // skip '('

			const node = parseExpression();

			consume('paren', ')');
			return node;
		}

		throw new TypeError(
			`Unexpected token: ${JSON.stringify(token)} at ${current}`
		);
	}

	function parseExpression() {
		let node = parsePrimary();

		// Call expressions like func(arg, arg)
		while (peek() && peek().type === 'paren' && peek().value === '(') {
			node = parseCallExpression(node);
		}

		return node;
	}

	function parseCallExpression(callee) {
		consume('paren', '(');

		let args = [];
		if (peek() && !(peek().type === 'paren' && peek().value === ')')) {
			args.push(parseExpression());
			while (peek() && peek().type === 'comma') {
				advance(); // skip ','
				args.push(parseExpression());
			}
		}

		consume('paren', ')');

		return {
			type: 'CallExpression',
			callee,
			arguments: args,
		};
	}

	function parseBlock() {
		consume('curly', '{');

		let body = [];
		while (peek() && !(peek().type === 'curly' && peek().value === '}')) {
			body.push(parseStatement());
		}

		consume('curly', '}');

		return {
			type: 'BlockStatement',
			body,
		};
	}

	function parseVariable() {
		advance(); // consume 'variable'

		const identifier = consume('identifier');
		consume('equals');
		const value = parseExpression();

		return {
			type: 'VariableDeclaration',
			name: identifier.name,
			value,
		};
	}

	function parseIfStatement() {
		advance(); // consume 'if'

		// Condition
		consume('paren', '(');
		const condition = parseExpression();
		consume('paren', ')');

		// Body
		const body = parseBlock();

		let node = {
			type: 'IfStatement',
			condition,
			body,
			alternate: null,
		};

		if (peek()?.value === 'else') {
			advance(); // consume 'else'

			if (peek()?.value === 'if') {
				// else if
				node.alternate = parseIfStatement();
			} else {
				// else
				node.alternate = parseBlock();
			}
		}
		return node;
	}

	let ast = {
		type: 'Program',
		body: [],
	};

	while (!isAtEnd()) {
		ast.body.push(parseStatement());
	}

	return ast;
}
