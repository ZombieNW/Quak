import REGEXES from '../util/regexes.js';
import KEYWORDS from '../util/keywords.js';
import regexes from '../util/regexes.js';

export function lexer(input) {
	let current = 0;
	let tokens = [];

	while (current < input.length) {
		let char = input[current];

		if (REGEXES.whitespace.test(char)) {
			current++;
			continue;
		}
		if (REGEXES.paren.test(char)) {
			tokens.push({ type: 'paren', value: char });
			current++;
			continue;
		}
		if (REGEXES.curly.test(char)) {
			tokens.push({ type: 'curly', value: char });
			current++;
			continue;
		}
		if (REGEXES.number.test(char)) {
			let value = '';

			// Iterate through numbers
			while (REGEXES.number.test(char)) {
				value += char;
				char = input[++current];
			}

			tokens.push({ type: 'number', value: Number(value) });
			continue;
		}
		if (REGEXES.quote.test(char)) {
			let value = '';

			// Skip quotes and iterate through string
			char = input[++current];
			while (!REGEXES.quote.test(char)) {
				value += char;
				char = input[++current];
			}
			char = input[++current];

			tokens.push({ type: 'string', value });
			continue;
		}
		if (REGEXES.letter.test(char)) {
			let value = '';

			// Iterate through identifier
			while (REGEXES.letter.test(char)) {
				value += char;
				char = input[++current];
			}

			// Check if it's a keyword
			if (KEYWORDS[value]) {
				tokens.push({ type: 'keyword', value: KEYWORDS[value] });
				continue;
			}

			tokens.push({ type: 'identifier', name: value });
			continue;
		}
		if (REGEXES.comma.test(char)) {
			tokens.push({ type: 'comma', value: char });
			current++;
			continue;
		}
		if (REGEXES.equals.test(char)) {
			tokens.push({ type: 'equals', value: char });
			current++;
			continue;
		}
		if (REGEXES.plus.test(char)) {
			tokens.push({ type: 'plus', value: char });
			current++;
			continue;
		}
		if (REGEXES.minus.test(char)) {
			tokens.push({ type: 'minus', value: char });
			current++;
			continue;
		}
		if (REGEXES.multiply.test(char)) {
			tokens.push({ type: 'multiply', value: char });
			current++;
			continue;
		}
		if (REGEXES.divide.test(char)) {
			tokens.push({ type: 'divide', value: char });
			current++;
			continue;
		}
		if (REGEXES.exponent.test(char)) {
			tokens.push({ type: 'exponent', value: char });
			current++;
			continue;
		}
		if (REGEXES.ampersand.test(char)) {
			tokens.push({ type: 'ampersand', value: char });
			current++;
			continue;
		}
		if (REGEXES.colon.test(char)) {
			tokens.push({ type: 'colon', value: char });
			current++;
			continue;
		}
		if (REGEXES.dot.test(char)) {
			tokens.push({ type: 'dot', value: char });
			current++;
			continue;
		}

		throw new Error(`Unexpected character: ${char} at position ${current}`);
	}

	return tokens;
}
