import { Token } from "./lexer";
import { Saying } from "./models";
import { QueryOutput } from "@aws-sdk/client-dynamodb-v2-node";
import { ParseError } from "./errors";
import { evaluate } from "./evaluator"


class Node {
  literal: string = "";
  constructor(literal?: string) {
    if (typeof literal !== "undefined") {
      this.literal = literal;
    }

  }
  join(token: Token) {
    this.literal += token.literal;
  }
  get source() {
    return this.literal;
  }

  async eval(depth: number): Promise<string> {
    return "";
  };

}

class Expression extends Node {
  evaluate() {
    return this.literal;
  }
}

class Root extends Node {
  nodes: Node[] = [];

  async eval(depth: number) {
    let result: string = "";
    for (const node of this.nodes) {
      result += await node.eval(depth);
    }
    return result
  }
}

/** 文字列リテラル */
class StringLiteral extends Expression {
  join(token: Token) {
    this.literal += token.literal.slice(1, -1);
  }
  get source() {
    return `"${this.literal}"`;
  }

  async eval(depth: number) {
    return this.literal;
  }
}

class SayingNode extends Expression {
  get source() {
    return "{" + this.literal + "}";
  }

  private choice(items: QueryOutput["Items"]): any {
    const index = Math.floor(Math.random() * items.length);
    return items[index].word.S;
  }

  async eval(depth: number): Promise<string> {
    if (!await Saying.exists(this.literal)) {
      return (this.literal);
    } else {
      const choosen = this.choice((await Saying.list(this.literal)).Items);
      return evaluate(choosen, depth);
    }
  }
}

export { Root, Node, SayingNode, StringLiteral };
