import { Saying } from './models'
import { evaluate } from './evaluator'
import { App } from '@slack/bolt'
import { normalize } from './utils'

const command: string = 'saying'
const helptext = `語録コマンド \`saying\`

登録した語録を組み合わせて文章を生成できるコマンドです。

*語録操作*
*登録*: \`?saying create 語録名 [説明]\`
*説明文登録*: \`?saying description 語録名 説明\`
*削除*: \`?saying delete|del 語録名\`
*一覧*: \`?saying list|ls 語録名\`
*語録の一覧*: \`?saying keywords\`

*語録追加・削除*
*語録への追加*: \`?+語録名 ワード\`
*語録から削除*: \`?-語録名 ワード\`

*語録を表示*
\`!\`で開始した文章は語録表示として解析されます

*語録からランダムに一つ表示*: \`{語録名}\` あるいは \`語録名\`
*プレーンテキストとして表示*: \`"テキスト"\`

*組み合わせ例*

\`!{誰}"は"{何}"を{どのように}"した"\`
\`!{５}" "{７}" "{５}\`

* 語録が登録されていない、もしくは登録ワードが0件の語録を表示した場合、プレーンテキストの扱いになります

*入力*: \`!未登録ワード\`
*出力*: \`未登録ワード\`

* プレーンテキストではない半角スペースはデリミタとみなされますが、出力の際は無視されます
  * 入力 \`!５７５ ７ ７\` は、\`{５７５}{７}{７}\` と同等の入力とみなされます。

* 語録に語録を登録すると再帰的に評価されます
  * 無駄に再帰評価されるのを防ぐため、曖昧な表記のみで構成されたワードは登録時にプレーンテキストとして正規化されます。
  * 再帰的な語録として登録したい場合は、{}を使って明示的に語録参照として記述してください
  * 明示的なプレーンテキストとの複合表記でもそのまま登録されます

\`?+誰 太郎\` ("太郎"に正規化される)
\`?+誰 {何}\` (そのまま登録)
\`?+誰 何"太郎"\` (そのまま登録)


*その他*
*ヘルプ*: \`?saying help\`
`
interface botCommand {
  (args: string[]): Promise<string>;
}

export const subCommands: { [key: string]: botCommand } = {
  create: async args => {
    const keyword = args[0]
    const description = args.length === 2 ? args[1] : ''

    if (/^\w$/.test(keyword)) {
      return '半角1文字の語録は登録できません'
    }
    if (await Saying.exists(keyword)) {
      return `語録「${keyword}」はすでに登録済みです`
    }
    await Saying.create(keyword, description)
    return `語録「${keyword}」を登録しました`
  },
  description: async args => {
    const keyword = args[0]
    const description = args[1]

    if (!await Saying.exists(keyword)) {
      return `語録「${keyword}」は登録されていません`
    }
    await Saying.create(keyword, description)
    return `語録「${keyword}」に説明文を登録しました
"${description}"`
  },
  'delete|del': async args => {
    const keyword = args[0]
    if (!await Saying.exists(keyword)) {
      return `「${keyword}」という語録は存在しません`
    }
    await Saying.delete(keyword)
    return `語録「${keyword}」を削除しました`
  },
  'list|ls': async args => {
    const keyword = args[0]
    const wds = await Saying.list(keyword)
    let wordlist = ''
    let count = 0
    if (!wds.Items) { return `「${keyword}」には何も登録されていません` }
    for (const word of wds.Items) {
      wordlist += word.word.S + '\n'
      count++
    }
    return `「${keyword}」の登録ワード(${count})\n\n${wordlist}`
  }
}

export default (app: App): void => {
  for (const subcommand in subCommands) {
    const ptn = new RegExp(String.raw`^\?${command} (${subcommand})(?<args> .*)`)
    const commandFunc = subCommands[subcommand]

    app.message(ptn, async ({ context, say }) => {
      const args = context.matches[2].trim().split(' ')
      const msg = await commandFunc(args)
      await say(msg)
    })
  }
  app.message(/^\?\+(?<keyword>[^ \n]+) (?<word>.*)/s, async ({ context, say }) => {
    const keyword = context.matches.groups.keyword
    const word = normalize(context.matches.groups.word)
    await Saying.add(keyword, word)
    await say(`${keyword}語録に「${word}」を登録しました`)
  })

  app.message(/^\?-(?<keyword>[^ \n]+) (?<word>.*)/s, async ({ context, say }) => {
    const keyword = context.matches.groups.keyword
    const word = normalize(context.matches.groups.word)
    await Saying.remove(keyword, word)
    await say(`${keyword}語録から「${word}」を削除しました`)
  })

  app.message(/^!(.*)/s, async ({ context, say }) => {
    const source = context.matches[1].trim()

    try {
      const result = await evaluate(source, 0)
      await say(result)
    } catch (e) {
      await say(`${e}`)
    }
  })

  app.message(/^\?saying keywords$/, async ({ context, say }) => {
    const kws = await Saying.keywords()
    let wordlist = ''
    let count = 0
    for (const keyword of kws.Items) {
      wordlist += keyword.keyword.S
      if (keyword.description.S) { wordlist += `: ${keyword.description.S}` }
      wordlist += '\n'
      count++
    }
    await say(`語録一覧(${count})\n\n${wordlist}`)
  })

  app.message(/^\?saying help$/, async ({ context, say }) => {
    await say(helptext)
  })
}
