const Social = require(`${process.cwd()}/base/Social.js`);
const snekfetch = require("snekfetch");

class Fortune extends Social {
  constructor(client) {
    super(client, {
      name: "fortune",
      description: "This command will give you a fortune from a fortune cookie.",
      usage: "fortune",
      category: "Fun",
      cost: 5,
      aliases: ["fortune-cookie"]
    });
  }

  async run(message, args, level) { // eslint-disable-line no-unused-vars
    if (message.settings.socialSystem === "true") {
      if (!(await this.cmdPay(message, message.author.id, this.help.cost))) return;
    }
    const msg = await message.channel.send(`<a:typing:397490442469376001> **${message.member.displayName}** is opening a fortune-cookie...`);
    let body = await snekfetch.get("https://mk-web.glitch.me/API/fortune").set("Authentication", "TOKEN HERE");
    msg.edit(body.text)
  }

}

module.exports = Fortune;
