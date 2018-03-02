const Command = require(`${process.cwd()}/base/Command.js`);
class Vaportype extends Command {
  constructor(client) {
    super(client, {
      name: "vaportype",
      description: "W O A H  D U D E  S P A C E D  O U T",
      usage: "vaportype <text>",
      category: "fun",
      aliases: ["vapor", "vpt"]
    });
  }

  async run(message, args) {
    args[0] ? this.space(message, args) : message.reply("you have to provide me text to space out you baka.");
  }

  async space(message, args) {
    let msg = "";
    for (const c of args) { msg += c.toUpperCase().split("").join(" ") + "  "; }
    return message.channel.send(msg);
  }
}

module.exports = Vaportype;
