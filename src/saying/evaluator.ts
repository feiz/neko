import { Node } from "./ast"
import { Parser } from "./parser";
import { Lexer } from "./lexer";

class Evaluator {
    constructor(private depth: number) { }

    async eval(node: Node) {
        return node.eval(this.depth);
    }

}

export async function evaluate(source: string, depth: number) {
    const evaluator = new Evaluator(depth);
    return evaluator.eval(new Parser(new Lexer(source)).parse());
}