import { readFileSync } from "fs";
import { lexer } from "./core/lexer.js";
import { parser } from "./core/parser.js";
import { transformer } from "./core/transformer.js";
import { generator } from "./core/generator.js";

function compiler(input) {
  let tokens = lexer(input);
  let ast = parser(tokens);
  let newAst = transformer(ast);
  let output = generator(newAst);

  return output;
}

function main() {
  let fileName = process.argv[2];
  let input = readFileSync(fileName, "utf-8");
  let output = compiler(input);

  console.log(output);
}

main();
