const Social = require("../../../structures/Social.js");
const { get } = require("snekfetch");

class Hentai extends Social {
  constructor(...args) {
    super(...args, {
      name: "hentai",
      description: "This command will return hentai.",
      category: "NSFW",
      usage: "hentai",
      cost: 40,
      cooldown: 10,
      loadingString: "<a:typing:397490442469376001> **{{displayName}}** is looking for hentai..."
    });
  }

  async run(message, args, level, loadingMessage) { // eslint-disable-line no-unused-vars
    if (!message.channel.nsfw) return message.response("🔞", "Cannot display NSFW content in a SFW channel.");
    const { body } = await get("https://nekobot.xyz/api/image?type=hentai");
    await loadingMessage.edit({
      embed: {
        "title": "Click here if the image failed to load.",
        "url": body.message,
        "color": message.guild ? message.guild.me.roles.highest.color : 5198940,
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

module.exports = Hentai;