import './echo'
import './saying'
import { app, expressReceiver, setUp } from './app'

const serverlessExpress = require('@vendia/serverless-express')

setUp(app)

export const handler = serverlessExpress({ app: expressReceiver.app })

export default {
  handler: 'src/slack.handler',
  events: [
    {
      http: {
        method: 'post',
        path: 'slack/events'
      }
    }
  ]
}
