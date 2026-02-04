import { createInterface } from 'node:readline/promises';

export default {
	print: (...args) => {
		console.log(...args);
		return null;
	},
	warn: (...args) => {
		console.warn(...args);
		return null;
	},
	error: (...args) => {
		console.error(...args);
		return null;
	},
	add: (...args) => {
		return args.reduce((a, b) => a + b);
	},
	subtract: (...args) => {
		return args.reduce((a, b) => a - b);
	},
	multiply: (...args) => {
		return args.reduce((a, b) => a * b);
	},
	divide: (...args) => {
		return args.reduce((a, b) => a / b);
	},
	equals: (...args) => {
		return args.reduce((a, b) => a === b);
	},
	prompt: async (...args) => {
		const rl = createInterface({
			input: process.stdin,
			output: process.stdout,
		});
		const answer = await rl.question(args[0]);
		rl.close();
		return answer.trim();
	},
};
