const Social = require(`${process.cwd()}/base/Social.js`);
const snek = require("snekfetch");
class Xkdc extends Social {
  constructor(client) {
    super(client, {
      name: "xkdc",
      description: "Get the daily comic from XKDC",
      category: "Fun",
      usage: "xkdc",
      cooldown: 10,
      botPerms: ["EMBED_LINKS"]
    });
  }
  async run(message, args, level) { // eslint-disable-line no-unused-vars
    const inf = await snek.get("https://xkcd.com/info.0.json");
    const ob = await inf.body;
    message.channel.send({"embed": {"author":{"name":"Okami-Bot"}, "description":`${ob.title} | #${ob.num}\n${ob.alt}`, "image":{"url":ob.img}}});
  }
}

module.exports = Xkdc;
