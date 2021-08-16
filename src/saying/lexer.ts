enum TokenType {
  IDENT,
  NUMBER,
  STRING,
  LBRACE,
  RBRACE,
  LPARENTHESIS,
  RPARENTHESIS,
  COMMA,
  SPACE,
  ILLEGAL,
  EOF
}

interface Token {
  type: TokenType;
  literal: string;
}

const NOT_IDENT = /[ \.\{\}\(\)\[\]]/
class Lexer {
  current: number;
  tokenizer: Generator<Token>;

  constructor (private source: string) {
    this.current = 0
    this.tokenizer = this.tokenize()
  }

  /**
   * 現在の文字
   */
  get ch (): string {
    if (this.current >= this.source.length) {
      return null
    }
    return this.source[this.current]
  }

  /**
   * 現在の文字の次の文字
   */
  nextCh (): string {
    if (this.current + 1 >= this.source.length) {
      return null
    }
    return this.source[this.current + 1]
  }

  /**
   * カウンタを次に進める
   */
  next (): void {
    this.current++
  }

  /**
   * current～ptnにマッチする文字までを切り出す
   *
   * @param ptn fetchの末端
   * @param terminateAtEOF eofを末端扱いする
   * @param includeTerminal 末端を切り出し対象に含める。trueにした場合もeofは含まれない。
   */
  fetchTo (
    ptn: RegExp,
    terminateAtEOF: Boolean,
    includeTerminal: Boolean
  ): string {
    let content = this.ch
    this.next()
    while (!ptn.test(this.ch)) {
      if (this.ch == null) {
        if (terminateAtEOF) {
          return content
        } else {
          throw Error('EOF')
        }
      }
      content += this.ch
      this.next()
    }
    if (includeTerminal) {
      content += this.ch
      this.next()
    }

    return content
  }

  * tokenize (): Generator<Token> {
    while (this.ch != null) {
      const token = null
      switch (this.ch) {
        case '{':
          yield { type: TokenType.LBRACE, literal: '{' }
          this.next()
          break
        case '}':
          yield { type: TokenType.RBRACE, literal: '}' }
          this.next()
          break
        case '(':
          yield { type: TokenType.LPARENTHESIS, literal: '(' }
          this.next()
          break
        case ')':
          yield { type: TokenType.RPARENTHESIS, literal: ')' }
          this.next()
          break
        case ' ':
          this.fetchTo(/[^ ]/, true, false) // 連続するスペースの読み飛ばし
          // yield { type: TokenType.Space, literal: " " };
          break
        case ',':
          yield { type: TokenType.COMMA, literal: ',' }
          this.next()
          break
        case '"':
          yield {
            type: TokenType.STRING,
            literal: this.fetchTo(/"/, false, true)
          }
          break
        default:
          if (NOT_IDENT.test(this.ch)) {
            throw Error(`Illegal Character: ${this.ch}`)
          }
          yield {
            type: TokenType.IDENT,
            literal: this.fetchTo(/[ \{\}\(\),\.,"]/, true, false)
          }
          break
      }
    }
    yield { type: TokenType.EOF, literal: null }
  }

  nextToken (): Token {
    return this.tokenizer.next().value
  }
}

export { Lexer, TokenType, Token }
