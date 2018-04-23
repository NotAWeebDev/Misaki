const Social = require("../../structures/Social.js");
const { get } = require("snekfetch");
class Gif extends Social {
  constructor(...args) {
    super(...args, {
      name: "gif",
      description: "Random gif time",
      category: "Fun",
      usage: "gif",
      cost: 5,
      cooldown: 10,
      aliases: ["giphy"],
      loadingString: "<a:typing:397490442469376001> **Searching** please wait a few moments.",
      botPerms: ["EMBED_LINKS"]
    });
  }
  async run(message, args, level) { // eslint-disable-line no-unused-vars
    const list = await get("http://replygif.net/api/tags?api-key=39YAprx5Yi");
    const tag = list.body.random();
    const giflist = await get(`http://replygif.net/api/gifs?tag=${tag.title}&api-key=39YAprx5Yi`);
    message.channel.send({
      "embed": {
        "image": {
          "url": giflist.body.random().file
        },
        "footer": {
          "icon_url": message.author.displayAvatarURL({ format: "png", size: 32 }),
          "text": `Requested by ${message.author.tag} | Powered by ReplyGif.net`
        }
      }
    });
  }
}

module.exports = Gif;