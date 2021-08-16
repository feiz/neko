import { normalize } from '../utils'

test('NakedSayingだけのsourceがStringLiteralに正規化される', () => {
  function normalized (source: string) {
    expect(normalize(source)).toEqual(`"${source}"`)
  }
  normalized('test')
  normalized('test test')
  normalized('test\nあいうえ\n')
})

test('他のNodeが含まれているものはそのままになる', () => {
  function unchanged (source: string) {
    expect(normalize(source)).toEqual(source)
  }

  unchanged('"test"')
  unchanged('test" "test')
  unchanged('{test}')
  unchanged('test {test}')
})
