const Social = require(`${process.cwd()}/base/Social.js`);
const snekfetch = require("snekfetch");

class Oneliner extends Social {
  constructor(client) {
    super(client, {
      name: "joke",
      description: "Thie command will give you a one liner joke.",
      usage: "joke",
      category: "Fun",
      cost: 5,
      aliases: ["1l", "oneliner"]
    });
  }

  async run(message, args, level) { // eslint-disable-line no-unused-vars
    if (message.settings.socialSystem === "true") {
      if (!(await this.cmdPay(message, message.author.id, this.help.cost))) return;
    }
    const msg = await message.channel.send(`<a:typing:397490442469376001> **${message.member.displayName}** is thinking of something funny...`);
    const { body } = await snekfetch.get("https://dashboard.typicalbot.com/api/v1/joke").set("Authorization", this.client.config.apiTokens.tbToken);
    msg.edit(body.data);
  }

}

module.exports = Oneliner;
