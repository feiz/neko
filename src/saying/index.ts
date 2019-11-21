import { app } from "../app";

const command: string = "saying";

interface botCommand {
  (args: string[]): string;
}

const subCommands: { [key: string]: botCommand } = {
  create: args => {
    return args[1];
  },
  delete: args => {
    return "";
  },
  list: args => {
    return "";
  }
};

for (let subcommand in subCommands) {
  const ptn = new RegExp(String.raw`^\?${command} ${subcommand}(?<args> .*)`);
  const commandFunc = subCommands[subcommand];

  app.message(ptn, async ({ context, say }) => {
    const args = context.matches[1].trim().split(" ");
    const msg = commandFunc(args);
    say(msg);
  });
}
