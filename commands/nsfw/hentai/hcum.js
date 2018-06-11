const Social = require("../../../structures/Social.js");
const { get } = require("snekfetch");

class HCum extends Social {
  constructor(...args) {
    super(...args, {
      name: "hcum",
      description: "This command will return hentai porn in gif form.",
      category: "NSFW",
      usage: "hcum",
      cost: 40,
      cooldown: 10,
      loadingString: "<a:typing:397490442469376001> **{{displayName}}** is gonna blow...",
      aliases: ["hcumsluts"]
    });
  }

  async run(message, args, level, loadingMessage) { // eslint-disable-line no-unused-vars
    if (!message.channel.nsfw) return message.response("🔞", "Cannot display NSFW content in a SFW channel.");

    const { body } = await get("https://nekos.life/api/v2/img/cum");
    await loadingMessage.edit({
      embed: {
        "title": "Click here if the image failed to load.",
        "url": body.url,
        "color": 6192321,
        "image": {
          "url": body.url
        },
        "footer": {
          "icon_url": message.author.displayAvatarURL({ format: "png", size: 32 }),
          "text": `Requested by ${message.author.tag} | Powered by Nekos.life API`
        }
      }
    });
  }
}

module.exports = HCum;