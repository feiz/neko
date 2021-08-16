import { NakedSayingNode, SayingNode } from './ast'
import { Lexer } from './lexer'
import { Parser } from './parser'

/**
 * 入力文字列を正規化する
 *
 * NakedSayingNodeのみで構成された入力は全体をStringLiteralであるとみなして""で囲んで返す
 *
 * @param source
 * @returns string
 */
export function normalize (source: string): string {
  const rootNode = (new Parser(new Lexer(source))).parse()
  for (const node of rootNode.nodes) {
    if (!(node instanceof NakedSayingNode)) {
      return source
    }
  }

  return `"${source}"`
}
