import { Node } from './ast'
import { Parser } from './parser'
import { Lexer } from './lexer'
import { ParseError } from './errors'

class Evaluator {
  constructor (private depth: number) { }

  async eval (node: Node) {
    return node.eval(this.depth)
  }
}

export async function evaluate (source: string, depth: number) {
  if (depth > 3) {
    console.log('recursive')
    throw new ParseError('recursive evaluation detected.')
  }
  const evaluator = new Evaluator(depth)
  return evaluator.eval(new Parser(new Lexer(source)).parse())
}
