import { app } from 'src/app'

app.message('echo', async ({ message, say }): Promise<void> => {
  await say('私は卑しい豚です')
})
