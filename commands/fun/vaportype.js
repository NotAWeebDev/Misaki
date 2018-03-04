const Command = require(`${process.cwd()}/base/Command.js`);
class Vaportype extends Command {
  constructor(client) {
    super(client, {
      name: "vaportype",
      description: "W O A H  D U D E  S P A C E D  O U T",
      usage: "vaportype <text>",
      category: "Fun",
      aliases: ["vapor", "vpt"]
    });
  }

  async run(message, args) {
    if (!args.length) return message.reply("you have to provide me text to space out you baka."); // Test for any args.
    let msg = "";
    for (let i = 0; i < args.length; i++) msg += args[i].toUpperCase().split("").join(" ") + "  "; // Split up the arguments, then add to msg.
    return message.channel.send(msg);
  }

}

module.exports = Vaportype;
