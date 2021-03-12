import { App, ExpressReceiver } from '@slack/bolt'
import echo from './echo'
import saying from './saying'

export const expressReceiver = new ExpressReceiver({
  signingSecret: process.env.SLACK_SIGNING_SECRET,
  processBeforeResponse: true
})

export const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  receiver: expressReceiver
})

export const setUp = (app: App): void => {
  echo(app)
  saying(app)
}
