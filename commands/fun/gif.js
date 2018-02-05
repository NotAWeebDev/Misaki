const Social = require(`${process.cwd()}/base/Social.js`);
const snekfetch = require("snekfetch");
class Gif extends Social {
  constructor(client) {
    super(client, {
      name: "gif",
      description: "Random gif time",
      category: "Fun",
      usage: "gif",
      cost: 5,
      cooldown: 10,
      aliases: ["giphy"]
    });
  }
  async run(message, args, level) { // eslint-disable-line no-unused-vars
    if (message.settings.socialSystem === "true") {
      if (!(await this.cmdPay(message, message.author.id, this.help.cost))) return;
    }
    const list = await snekfetch.get("http://replygif.net/api/tags?api-key=39YAprx5Yi");
    const tag = list.body.random();
    const giflist = await snekfetch.get(`http://replygif.net/api/gifs?tag=${tag.title}&api-key=39YAprx5Yi`);
    message.channel.send({"embed":{"image":{"url":giflist.body.random().file}}});
  }
}

module.exports = Gif;
