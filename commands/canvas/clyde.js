const Social = require("../../structures/Social.js");
const { get } = require("snekfetch");

class Clyde extends Social {
  constructor(...args) {
    super(...args, {
      name: "clyde",
      description: "Have Clyde say something.",
      usage: "clyde <text>",
      category: "Canvas",
      cost: 5,
      cooldown: 5,
      loadingString: "<a:typing:397490442469376001> **Clyde** is typing...",
      botPerms: ["EMBED_LINKS"]
    });
  }

  async run(message, args, level, loadingMessage) {
    const text = args.join(" ");
    const { body } = await get(`https://nekobot.xyz/api/imagegen?type=clyde&text=${text}`);

    return loadingMessage.edit({
      embed: {
        "title": "Click here if the image failed to load.",
        "url": body.message,
        "color": 6192321,
        "image": {
          "url": body.message
        },
        "footer": {
          "icon_url": message.author.displayAvatarURL({ format: "png", size: 32 }),
          "text": `Requested by ${message.author.tag} | Powered by NekoBot API`
        }
      }
    });
  }

}
module.exports = Clyde;
