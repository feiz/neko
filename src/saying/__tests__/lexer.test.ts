import { handler } from 'src/slack'
import { Lexer, TokenType } from '../lexer'

test('tokeinze', () => {
  expect([...new Lexer('東京は{いつ}"の"(7時 )   ').tokenize()]).toEqual([
    { type: TokenType.IDENT, literal: '東京は' },
    { type: TokenType.LBRACE, literal: '{' },
    { type: TokenType.IDENT, literal: 'いつ' },
    { type: TokenType.RBRACE, literal: '}' },
    { type: TokenType.STRING, literal: '"の"' },
    { type: TokenType.LPARENTHESIS, literal: '(' },
    { type: TokenType.IDENT, literal: '7時' },
    // { type: TokenType.Space, literal: " " },
    { type: TokenType.RPARENTHESIS, literal: ')' },
    // { type: TokenType.Space, literal: " " },
    { type: TokenType.EOF, literal: null }
  ])
})

test('スペースの混じったSTRING', () => {
  expect([...new Lexer(' "あ い"{うえ}" "').tokenize()]).toEqual([
    { type: TokenType.STRING, literal: '"あ い"' },
    { type: TokenType.LBRACE, literal: '{' },
    { type: TokenType.IDENT, literal: 'うえ' },
    { type: TokenType.RBRACE, literal: '}' },
    { type: TokenType.STRING, literal: '" "' },
    { type: TokenType.EOF, literal: null }
  ])
})

test('改行', () => {
  expect([...new Lexer('"a\nb"').tokenize()]).toEqual([
    { type: TokenType.STRING, literal: '"a\nb"' },
    { type: TokenType.EOF, literal: null }
  ])
})
