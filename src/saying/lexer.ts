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
    if (this.current >= this.source.length) {
      return null;
    }
    return this.source[this.current];
  }

  /**
   * 現在の文字の次の文字
   */
  nextCh(): string {
    if (this.current + 1 >= this.source.length) {
      return null;
    }
    return this.source[this.current + 1];
  }

  /**
   * カウンタを次に進める
   */
  next(): void {
    this.current++;
  }

  /**
   * current～ptnにマッチする文字までを切り出す
   *
   * @param ptn fetchの末端
   * @param terminateAtEOF eofを末端扱いする
   * @param includeTerminal 末端を切り出し対象に含める。trueにした場合もeofは含まれない。
   */
  fetchTo(
    ptn: RegExp,
    terminateAtEOF: Boolean,
    includeTerminal: Boolean
  ): string {
    let content = this.ch();
    this.next();
    while (!ptn.test(this.ch())) {
      if (this.ch() == null) {
        if (terminateAtEOF) {
          return content;
        } else {
          throw Error("EOF");
        }
      }
      content += this.ch();
      this.next();
    }
    if (includeTerminal) {
      content += this.ch();
      this.next();
    }

    return content;
  }
}

enum TokenType {
  Ident,
  Number,
  String,
  LBrace,
  RBrace,
  LParenthesis,
  RParenthesis,
  Comma,
  Space,
  Illegal,
  EOF
}

interface Token {
  type: TokenType;
  literal: string;
}

const NOT_IDENT = /[ \.\{\}\(\)\[\]]/;

function tokenize(source: string): Token[] {
  const lexer = new Lexer(source);
  let tokens: Token[] = [];
  while (lexer.ch() != null) {
    let token = null;
    switch (lexer.ch()) {
      case "{":
        token = { type: TokenType.LBrace, literal: "{" };
        lexer.next();
        break;
      case "}":
        token = { type: TokenType.RBrace, literal: "}" };
        lexer.next();
        break;
      case "(":
        token = { type: TokenType.LParenthesis, literal: "(" };
        lexer.next();
        break;
      case ")":
        token = { type: TokenType.RParenthesis, literal: ")" };
        lexer.next();
        break;
      case " ":
        lexer.fetchTo(/[^ ]/, true, false); // 連続するスペースの読み飛ばし
        token = { type: TokenType.Space, literal: " " };
        break;
      case ",":
        token = { type: TokenType.Comma, literal: "," };
        lexer.next();
        break;
      case '"':
        token = {
          type: TokenType.String,
          literal: lexer.fetchTo(/"/, false, true)
        };
        break;
      default:
        if (NOT_IDENT.test(lexer.ch())) {
          throw Error(`Illegal Character: ${lexer.ch()}`);
        }
        token = {
          type: TokenType.Ident,
          literal: lexer.fetchTo(/[ \{\}\(\),\.,]/, true, false)
        };
        break;
    }
    tokens.push(token);
  }
  tokens.push({ type: TokenType.EOF, literal: null });
  return tokens;
}

export { tokenize, TokenType, Token };
