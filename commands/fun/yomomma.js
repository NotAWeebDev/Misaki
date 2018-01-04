const Command = require(`${process.cwd()}/base/Command.js`);
const snek = require("snekfetch");
class Ping extends Command {
  constructor(client) {
    super(client, {
      name: "yomomma",
      description: "Disrespect someone's mother with this.",
      category: "Fun",
      usage: "yomomma",
      aliases: ["yomama"],
      botPerms: []
    });
  }

  async run(message, args, level) { // eslint-disable-line no-unused-vars
    try {

      if (!(await this.cmdPay(message, message.author.id, this.help.cost, this.conf.botPerms))) return;

      const { text } = await snek.get("http://api.yomomma.info/");
      message.channel.send(`_${JSON.parse(text).joke}_`);
    } catch (error) {
      this.client.logger.error(error);
    }
  }
}

module.exports = Ping;