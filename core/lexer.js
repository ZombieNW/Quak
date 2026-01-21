import REGEXES from "../util/regexes.js";

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
