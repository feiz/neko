import { App } from '@slack/bolt'

export default (app: App) => {
  app.message('echo', async ({ message, say }): Promise<void> => {
    await say('私は卑しい豚です')
  })
}
