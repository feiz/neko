import { app } from '../app'
import { Saying } from './models'
import { evaluate } from './evaluator'

const command: string = 'saying'
const helptext = `語録コマンド \`saying\`

登録した語録を組み合わせて文章を生成できるコマンドです。語録を育ててたのしくあそぼう

*語録操作*
*登録*: \`?saying create 語録名\`
*削除*: \`?saying delete|del 語録名\`
*一覧*: \`?saying list|ls 語録名\`

*語録追加・削除*
*語録への追加*: \`?+語録名 ワード\`
*語録から削除*: \`?-語録名 ワード\`

*語録を表示*
\`!\`で開始した文章は語録表示として解析されます

*語録からランダムに一つ表示*: \`{語録名}\` あるいは \`語録名\`
*プレーンテキストとして表示*: \`"テキスト"\`

*組み合わせ例*

*入力*: \`!{誰}"は"{何}"を{どのように}"した"\`
*出力*: \`ぼくは神をバラバラにした\`
*入力*: \`!{５}" "{７}" "{５}\`
*出力*: \`五月雨を あつめて速し 雛見沢\`

* 語録が登録されていない、もしくは登録ワードが0件の語録を表示した場合、プレーンテキストの扱いになります
* プレーンテキストではない半角スペースはデリミタとみなされますが、出力の際は無視されます
  * 入力 \`!５７５ ７ ７\` は、\`{５７５}{７}{７}\` と同等の入力とみなされます。

*入力*: \`!未登録ワード\`
*出力*: \`未登録ワード\`

*その他*
*ヘルプ*: \`?saying help\`
`
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
    let count = 0
    if (!wds.Items) { return `「${keyword}」には何も登録されていません`}
    for (const word of wds.Items) {
      wordlist += word.word.S + '\n'
      count++
    }
    return `「${keyword}」の登録ワード(${count})\n\n${wordlist}`
  }
}

for (const subcommand in subCommands) {
  const ptn = new RegExp(String.raw`^\?${command} (${subcommand})(?<args> .*)`)
  const commandFunc = subCommands[subcommand]

  app.message(ptn, async ({ context, say }) => {
    const args = context.matches[2].trim().split(' ')
    const msg = await commandFunc(args)
    await say(msg)
  })
}
app.message(/^\?\+(?<keyword>.*) (?<word>.*)/, async ({ context, say }) => {
  const keyword = context.matches[1]
  const word = context.matches[2]
  await Saying.add(keyword, word)
  await say(`${keyword}語録に「${word}」を登録しました。`)
})

app.message(/^\?-(?<keyword>.*) (?<word>.*)/, async ({ context, say }) => {
  const keyword = context.matches[1]
  const word = context.matches[2]
  await Saying.remove(keyword, word)
  await say(`${keyword}語録から「${word}」を削除しました。`)
})
//app.message(/^\?^(?<keyword>.*)/, async ({ context, say }) => {
//  const keyword = context.matches[1]
//  await Saying.pop(keyword, 'feiz')
//})

app.message(/^!(.*)/, async ({ context, say }) => {
  const source = context.matches[1].trim()

  try {
    const result = await evaluate(source, 0)
    await say(result)
  } catch (e) {
    await say(`${e}`)
  }
})

app.message(/^\?saying help$/, async ({context, say}) => {
  await say(helptext)
})