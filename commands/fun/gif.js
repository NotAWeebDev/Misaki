const Social = require(`${process.cwd()}/base/Social.js`);
const snek = require("snekfetch");
class Gif extends Social {
  constructor(client) {
    super(client, {
      name: "gif",
      description: "Random gif time",
      category: "Fun",
      usage: "gif",
      cooldown: 10,
      botPerms: ["EMBED_LINKS"]
    });
  }
  async run(message, args, level) { // eslint-disable-line no-unused-vars
    const list = await snek.get("http://replygif.net/api/tags?api-key=39YAprx5Yi");
    const tag = list.body.random();
    const giflist = await snek.get(`http://replygif.net/api/gifs?tag=${tag.title}&api-key=39YAprx5Yi`);
    message.channel.send({"embed":{"image":{"url":giflist.body.random().file}}});
  }
}

module.exports = Gif;
