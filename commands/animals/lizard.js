const Social = require("../../structures/Social.js");
const { get } = require("snekfetch");

class Lizard extends Social {
  constructor(...args) {
    super(...args, {
      name: "lizard",
      description: "Post a randomly selected image of a lizard.",
      category: "Animals",
      usage: "lizard",
      extended: "This command will return a beautiful lizard.",
      cost: 5,
      cooldown: 10,
      aliases: ["geko"],
      loadingString: "<a:typing:397490442469376001> **{{displayName}}** is looking for a lizard...",
      botPerms: ["EMBED_LINKS"]
    });
  }

  async run(message, args, level, loadingMessage) {
    const { body } = await get("https://nekos.life/api/v2/img/lizard");
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

module.exports = Lizard;