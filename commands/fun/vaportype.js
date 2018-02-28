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

  async run(message, args, level) { // eslint-disable-line no-unused-vars
    args[0] ? this.space(message, args) : message.reply("you have to provide me text to space out you baka.");
  }

  async space(message, args) {
    let msg = "";
    await args.forEach(c => msg += c.toUpperCase().split("").join(" ") + "  ");
    message.channel.send(msg);
  }
}

module.exports = Vaportype;
