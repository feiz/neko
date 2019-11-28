import { Parser } from "../parser";
import { Lexer } from "../lexer";
import { SayingNode, StringLiteral } from "../ast";

test("basic parse", () => {
  const parser = new Parser(new Lexer(`５" "{７}" やばい"3`));
  const root = parser.parse();
  expect(root.nodes[0]).toBeInstanceOf(SayingNode);
  expect(root.nodes[0].literal).toBe("５");

  expect(root.nodes[1]).toBeInstanceOf(StringLiteral);
  expect(root.nodes[1].literal).toBe(" ");

  expect(root.nodes[2]).toBeInstanceOf(SayingNode);
  expect(root.nodes[2].literal).toBe("７");

  expect(root.nodes[3]).toBeInstanceOf(StringLiteral);
  expect(root.nodes[3].literal).toBe(" やばい");

  expect(root.nodes[4]).toBeInstanceOf(SayingNode);
  expect(root.nodes[4].literal).toBe("3");
});
