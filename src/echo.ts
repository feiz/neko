import { App } from '@slack/bolt'

export default (app: App) => {
  app.message(/^\?echo$/, async ({ context, say }): Promise<void> => {
    await say(':hispeed_sharkdance:')
  })
}
