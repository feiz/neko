import { App } from "@slack/bolt";

const app = new App({
    token: process.env.SLACK_BOT_TOKEN,
    signingSecret: process.env.SLACK_SIGNING_SECRET
});

app.message("aho", ({ context, say }) => { say("はい") });

export { app };