import { tokenize, Token, TokenType } from "../lexer";

test("tokeinze", () => {
  expect(tokenize(`東京は{いつ}"の"(7時 )   `)).toEqual([
    { type: TokenType.Ident, literal: "東京は" },
    { type: TokenType.LBrace, literal: "{" },
    { type: TokenType.Ident, literal: "いつ" },
    { type: TokenType.RBrace, literal: "}" },
    { type: TokenType.String, literal: `"の"` },
    { type: TokenType.LParenthesis, literal: "(" },
    { type: TokenType.Ident, literal: "7時" },
    { type: TokenType.Space, literal: " " },
    { type: TokenType.RParenthesis, literal: ")" },
    { type: TokenType.Space, literal: " " },
    { type: TokenType.EOF, literal: null }
  ]);
});
