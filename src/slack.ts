import './echo'
import './saying'
export { handler } from './app'

// echo(app)

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
