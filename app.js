const { App } = require('@slack/bolt')

const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET

});


app.message('hello', async ({ message, say }) => {
  say(`Hey there <@${message.user}>!`);
});

app.message(/^!(.*)/, async ({ context, say }) => {
  say(`${context.matches[1]}`);
});

(async () => {
  await app.start(process.env.PORT || 3000);
  console.log('Bolt app is running!');
})();
