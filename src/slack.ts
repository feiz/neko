import './echo'
import './saying'
import {app, setUp} from './app'

const serverlessExpress = require('@vendia/serverless-express')

setUp(app)

export const handler = serverlessExpress({ app: app })

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
