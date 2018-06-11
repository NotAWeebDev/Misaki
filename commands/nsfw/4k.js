const Social = require("../../structures/Social.js");
const { get } = require("snekfetch");

class FOURK extends Social {
  constructor(...args) {
    super(...args, {
      name: "fourk",
      description: "This command will return 4K porn.",
      category: "NSFW",
      usage: "fourk",
      cost: 40,
      cooldown: 10,
      loadingString: "<a:typing:397490442469376001> **{{displayName}}** is looking at 4K porn 😎...",
      aliases: ["4k"]
    });
  }

  async run(message, args, level, loadingMessage) { // eslint-disable-line no-unused-vars
    if (!message.channel.nsfw) return message.response("🔞", "Cannot display NSFW content in a SFW channel.");
    const { body } = await get("https://nekobot.xyz/api/image?type=4k");
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

module.exports = FOURK;