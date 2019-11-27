import { tokenize, Token, TokenType } from "../lexer";

test("tokeinze", () => {
  expect(tokenize(`"一生"{サ変}"しような"`)).toEqual([
    { type: TokenType.String, literal: "一生" },
    { type: TokenType.Saying, literal: "サ変" },
    { type: TokenType.String, literal: "しような" }
  ]);
});
