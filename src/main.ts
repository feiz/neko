import { app } from "./app";
import "./saying";

app.message("echo", ({ message, say }) => {
  say("私は卑しい豚です");
});

(async () => {
  await app.start(process.env.PORT || 3000);
  console.log("server start");
})();
