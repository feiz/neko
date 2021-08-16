import { Saying } from '../models'

test('改行含み文字列の登録、削除', async () => {
  await Saying.create('A', '')
  await Saying.add('A', 'A\nB')
  let response
  response = await Saying.list('A')
  expect(response.Items.length).toBe(1)
  await Saying.remove('A', 'A\nB')
  response = await Saying.list('A')
  expect(response.Items).toEqual([])
})
