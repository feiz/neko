import { Token } from "./lexer";

class Node {
  literal: string = "";
  join(token: Token) {
    this.literal += token.literal;
  }
  get source() {
    return this.literal;
  }

  eval(depth: number): string {
    return ""
  }

}

class Expression extends Node {
  evaluate() {
    return this.literal;
  }
}

class Root extends Node {
  nodes: Node[] = [];
}

/** 文字列リテラル */
class StringLiteral extends Expression {
  join(token: Token) {
    this.literal += token.literal.slice(1, -1);
  }
  get source() {
    return `"${this.literal}"`;
  }

  eval(depth: number) {
    return this.literal;
  }
}

class SayingNode extends Expression {
  get source() {
    return "{" + this.literal + "}";
  }
}

export { Root, Node, SayingNode, StringLiteral };
