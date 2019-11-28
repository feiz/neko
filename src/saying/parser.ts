import { Lexer, Token, TokenType } from "./lexer";
import { Root, Node, SayingNode, StringLiteral } from "./ast";
import { ParseError } from "./errors";

class Parser {
  currentToken: Token;
  nextToken: Token;

  constructor(private lexer: Lexer) {
    this.next();
    this.next();
  }

  /**
   * 1トークン解析場所をすすめる
   */
  next() {
    this.currentToken = this.nextToken;
    this.nextToken = this.lexer.nextToken();
  }

  parse(): Root {
    const root = new Root();

    while (this.currentToken.type != TokenType.EOF) {
      root.nodes.push(this.parseExpression());
    }
    return root;
  }

  parseExpression(): Node {
    let node: Node;
    switch (this.currentToken.type) {
      case TokenType.LBRACE:
        node = this.parseBraceExpression();
        break;
      case TokenType.IDENT:
        node = this.parseNakedSaying();
        break;
      case TokenType.STRING:
        node = this.parseStringLiteral();
        break;
      default:
        throw new ParseError(`unknown token ${this.currentToken}`);
    }
    return node;
  }

  /** "{"始まりのブロック */
  parseBraceExpression(): Node {
    this.next();
    if (
      this.currentToken.type == TokenType.IDENT &&
      this.nextToken.type == TokenType.RBRACE
    ) {
      let node = new SayingNode();
      node.join(this.currentToken);
      this.next();
      this.next();
      return node;
    } else {
      throw new ParseError();
    }
  }

  /** IDENTが単体でおいてあるSaying */
  parseNakedSaying(): Node {
    const node = new SayingNode();
    node.join(this.currentToken);
    this.next();
    return node;
  }

  parseStringLiteral(): Node {
    const node = new StringLiteral();
    while (this.currentToken.type === TokenType.STRING) {
      node.join(this.currentToken);
      this.next();
    }
    return node;
  }
}

export { Parser };
