import { readFileSync } from 'fs';
import { lexer } from './core/lexer.js';
import { parser } from './core/parser.js';
import { transformer } from './core/transformer.js';
import { generator } from './core/generator.js';

function main() {
	let fileName = process.argv[2];
	let flags = process.argv.slice(3);
	let input = readFileSync(fileName, 'utf-8');

	let tokens = lexer(input);
	if (flags.includes('--tokens')) {
		return console.log(JSON.stringify(tokens, null, 2));
	}

	let ast = parser(tokens);
	if (flags.includes('--ast')) {
		return console.log(JSON.stringify(ast, null, 2));
	}

	let output = generator(newAst);
	console.log(output);
}

main();
