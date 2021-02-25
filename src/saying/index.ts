import { app } from '../app'
import { Saying } from './models'
import { evaluate } from './evaluator'

const command: string = 'saying'
interface botCommand {
  (args: string[]): Promise<string>;
}

const subCommands: { [key: string]: botCommand } = {
  create: async args => {
    const keyword = args[0]
    await Saying.create(keyword)
    return `語録「${keyword}」を登録しました`
  },
  'delete|del': async args => {
    const keyword = args[0]
    await Saying.delete(keyword)
    return `語録「${keyword}」を削除しました`
  },
  'list|ls': async args => {
    const keyword = args[0]
    const wds = await Saying.list(keyword)
    let wordlist = ''
    for (const word of wds.Items) {
      wordlist += word.word.S + '\n'
    }
    return wordlist + 'など'
  }
}

for (const subcommand in subCommands) {
  const ptn = new RegExp(String.raw`^\?${command} (${subcommand})(?<args> .*)`)
  const commandFunc = subCommands[subcommand]

  app.message(ptn, async ({ context, say }) => {
    const args = context.matches[2].trim().split(' ')
    const msg = await commandFunc(args)
    say(msg)
  })
}
app.message(/^\?\+(?<keyword>.*) (?<word>.*)/, async ({ context, say }) => {
  const keyword = context.matches[1]
  const word = context.matches[2]
  await Saying.add(keyword, word)
  say(`${keyword}語録に「${word}」を登録しました。`)
})
app.message(/^\?-(?<keyword>.*) (?<word>.*)/, async ({ context, say }) => {
  const keyword = context.matches[1]
  const word = context.matches[2]
  await Saying.remove(keyword, word)
  say(`${keyword}語録から「${word}」を削除しました。`)
})
app.message(/^\?^(?<keyword>.*)/, async ({ context, say }) => {
  const keyword = context.matches[1]
  await Saying.pop(keyword, 'feiz')
})

app.message(/^!(.*)/, async ({ context, say }) => {
  const source = context.matches[1].trim()

  try {
    const result = await evaluate(source, 0)
    say(result)
  } catch (e) {
    say(`${e}`)
  }
})
