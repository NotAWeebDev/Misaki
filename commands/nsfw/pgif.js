const Social = require("../../structures/Social.js");
const { get } = require("snekfetch");

class PGif extends Social {
  constructor(...args) {
    super(...args, {
      name: "pgif",
      description: "This command will return porn in gif form.",
      category: "NSFW",
      usage: "pgif",
      cost: 40,
      cooldown: 10,
      loadingString: "<a:typing:397490442469376001> **{{displayName}}** is looking for porn gifs...",
      aliases: ["porngif"]
    });
  }

  async run(message, args, level, loadingMessage) { // eslint-disable-line no-unused-vars
    if (!message.channel.nsfw) return message.response("🔞", "Cannot display NSFW content in a SFW channel.");
    const { body } = await get("https://nekobot.xyz/api/image?type=pgif");
    await loadingMessage.edit({
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

module.exports = PGif;