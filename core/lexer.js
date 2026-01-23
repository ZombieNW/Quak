import REGEXES from '../util/regexes.js';
import KEYWORDS from '../util/keywords.js';

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

		throw new Error(`Unexpected character: ${char} at position ${current}`);
	}

	return tokens;
}
