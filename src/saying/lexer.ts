enum SymbolType {
  Char,
  Number,
  LBrace,
  RBrace,
  LParenthesis,
  RParenthesis,
  Quote,
  Space
}

class Lexer {
  source: string;
  current: number;

  constructor(source: string) {
    this.source = source;
    this.current = 0;
  }

  /**
   * 現在の文字
   */
  ch(): string {
    return this.source[this.current];
  }

  /**
   * 現在の文字の次の文字
   */
  nextCh(): string {
    return this.source[this.current + 1];
  }

  /**
   * カウンタを次に進める
   */
  next(): void {
    this.current++;
  }

  typeOf(char: string): SymbolType {
    if (char === "{") {
      return SymbolType.LBrace;
    } else if (char === "}") {
      return SymbolType.RBrace;
    } else if (char === '"') {
      return SymbolType.Quote;
    } else if (char === "(") {
      return SymbolType.LParenthesis;
    } else if (char === ")") {
      return SymbolType.RParenthesis;
    } else if (char === " ") {
      return SymbolType.Space;
    } else if (/^[0-9]$/.test(char)) {
      return SymbolType.Number;
    } else {
      return SymbolType.Char;
    }
  }
}

enum TokenType {
  String,
  Integer,
  Saying,
  Function
}

interface Token {
  type: TokenType;
  literal: string;
}

function getSayingToken(lexer: Lexer): Token {
  let token = { type: TokenType.Saying, literal: "" };
  while (lexer.typeOf(lexer.nextCh()) !== SymbolType.RBrace) {
    lexer.next();
    token.literal += lexer.ch();
  }
  lexer.next();
  lexer.next();
  return token;
}

function getStringToken(lexer: Lexer): Token {
  let token = { type: TokenType.String, literal: "" };
  while (lexer.typeOf(lexer.nextCh()) !== SymbolType.Quote) {
    lexer.next();
    token.literal += lexer.ch();
  }
  lexer.next();
  lexer.next();
  return token;
}

function tokenize(source: string): Token[] {
  const lexer = new Lexer(source);
  let tokens: Token[] = [];
  while (lexer.ch() !== undefined) {
    let token = null;
    switch (lexer.typeOf(lexer.ch())) {
      case SymbolType.LBrace:
        token = getSayingToken(lexer);
        break;
      case SymbolType.Quote:
        token = getStringToken(lexer);
        break;
    }
    tokens.push(token);
  }
  return tokens;
}

export { tokenize, TokenType, Token };
