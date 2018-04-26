const Social = require("../../structures/Social.js");
const { get } = require("snekfetch");

class AAvatar extends Social {
  constructor(...args) {
    super(...args, {
      name: "aavatar",
      description: "This command will give you a random anime avatar",
      usage: "aavatar",
      category: "Fun",
      cost: 10,
      cooldown: 10,
      aliases: ["aav"],
      loadingString: "<a:typing:397490442469376001> **Searching** please wait a few moments.",
      botPerms: ["EMBED_LINKS"]
    });
  }

  async run(message, args, level, loadingMessage) {
    const { body } = await get(`https://nekos.life/api/v2/img/${message.channel.nsfw || message.channel.name.startsWith("nsfw-") || message.channel.name.startsWith("nsfw_") ? "nsfw_" : ""}avatar`);
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

module.exports = AAvatar;