import { readFileSync } from "fs";

const REGEXES = {
  number: /\d+/,
  paren: /[()]/g,
  letter: /[a-z]/i,
  whitespace: /\s/,
  quote: /\"/,
  newline: /\n/,
  tab: /\t/,
  comma: /,/,
  semicolon: /;/,
};

function tokenizer(input) {
  let current = 0;
  let tokens = [];

  while (current < input.length) {
    let char = input[current];

    if (REGEXES.whitespace.test(char)) {
      current++;
      continue;
    }
    if (REGEXES.paren.test(char)) {
      tokens.push({ type: "paren", value: char });
      current++;
      continue;
    }
    if (REGEXES.number.test(char)) {
      let value = "";

      while (REGEXES.number.test(char)) {
        value += char;
        char = input[++current];
      }

      tokens.push({ type: "number", value: Number(value) });
      continue;
    }
    if (REGEXES.quote.test(char)) {
      let value = "";

      char = input[++current]; // Skip Opening Quote
      while (!REGEXES.quote.test(char)) {
        value += char;
        char = input[++current];
      }
      char = input[++current]; // Skip Closing Quote

      tokens.push({ type: "string", value });
      continue;
    }
    if (REGEXES.letter.test(char)) {
      let value = "";

      while (REGEXES.letter.test(char)) {
        value += char;
        char = input[++current];
      }

      tokens.push({ type: "name", value });
      continue;
    }
    if (REGEXES.comma.test(char)) {
      tokens.push({ type: "comma", value: char });
      current++;
      continue;
    }
    if (REGEXES.newline.test(char)) {
      tokens.push({ type: "newline", value: char });
      current++;
      continue;
    }
    if (REGEXES.tab.test(char)) {
      tokens.push({ type: "tab", value: char });
      current++;
      continue;
    }
    if (REGEXES.semicolon.test(char)) {
      tokens.push({ type: "semicolon", value: char });
      current++;
      continue;
    }

    throw new Error(`Unexpected character: ${char}`);
  }

  return tokens;
}

function parser(tokens) {
  let current = 0;

  function walk() {
    let token = tokens[current];
    if (token.type === "number") {
      current++;

      return {
        type: "NumberLiteral",
        value: token.value,
      };
    }

    if (token.type === "string") {
      current++;

      return {
        type: "StringLiteral",
        value: token.value,
      };
    }

    if (token.type === "paren" && token.value === "(") {
      token = tokens[++current];

      let node = {
        type: "CallExpression",
        name: token.value,
        params: [],
      };

      token = tokens[++current];

      while (
        token.type !== "paren" ||
        (token.type === "paren" && token.value !== ")")
      ) {
        // we'll call the `walk` function which will return a `node` and we'll
        // push it into our `node.params`.
        node.params.push(walk());
        token = tokens[current];
      }

      current++;

      return node;
    }

    throw new TypeError(token.type);
  }

  let ast = {
    type: "Program",
    body: [],
  };

  while (current < tokens.length) {
    ast.body.push(walk());
  }

  return ast;
}

function traverser(ast, visitor) {
  function traverseArray(array, parent) {
    array.forEach((node) => {
      traverseNode(node, parent);
    });
  }

  function traverseNode(node, parent) {
    let methods = visitor[node.type];

    if (methods && methods.enter) {
      methods.enter(node, parent);
    }

    switch (node.type) {
      case "Program":
        traverseArray(node.body, node);
        break;
      case "CallExpression":
        traverseArray(node.params, node);
        break;
      case "NumberLiteral":
      case "StringLiteral":
        break;
      default:
        throw new TypeError(node.type);
    }

    if (methods && methods.exit) {
      methods.exit(node, parent);
    }
  }

  traverseNode(ast, null);
}

function transformer(ast) {
  let newAst = {
    type: "Program",
    body: [],
  };

  ast._context = newAst.body;

  traverser(ast, {
    NumberLiteral: {
      enter(node, parent) {
        parent._context.push({
          type: "NumberLiteral",
          value: node.value,
        });
      },
    },

    StringLiteral: {
      enter(node, parent) {
        parent._context.push({
          type: "StringLiteral",
          value: node.value,
        });
      },
    },

    CallExpression: {
      enter(node, parent) {
        let expression = {
          type: "CallExpression",
          callee: {
            type: "Identifier",
            name: node.name,
          },
          arguments: [],
        };

        node._context = expression.arguments;

        if (parent.type !== "CallExpression") {
          expression = {
            type: "ExpressionStatement",
            expression: expression,
          };
        }

        parent._context.push(expression);
      },
    },
  });

  return newAst;
}

function generator(node) {
  switch (node.type) {
    case "Program":
      return node.body.map(generator).join("");
    case "ExpressionStatement":
      return generator(node.expression) + ";";
    case "CallExpression":
      return (
        generator(node.callee) +
        "(" +
        node.arguments.map(generator).join(",") +
        ")"
      );
    case "Identifier":
      return node.name;
    case "NumberLiteral":
      return node.value;
    case "StringLiteral":
      return '"' + node.value + '"';
    default:
      throw new TypeError(node.type);
  }
}

function compiler(input) {
  let tokens = tokenizer(input);
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
