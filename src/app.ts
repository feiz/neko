import { App, AppOptions, ExpressReceiver } from '@slack/bolt'
import { serverlessExpress } from '@vendia/serverless-express'

const expressReceiver = new ExpressReceiver({
  signingSecret: process.env.SLACK_SIGNING_SECRET,
  processBeforeResponse: true
})
const options:AppOptions = {
  token: process.env.SLACK_BOT_TOKEN
}

if (process.env.DEVELOP) {
  options.signingSecret = process.env.SLACK_SIGNING_SECRET
} else {
  options.receiver = expressReceiver
}
const app = new App(options)

export const handler = serverlessExpress({ app: expressReceiver.app })
export { app }
