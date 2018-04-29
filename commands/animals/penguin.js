const Social = require("../../structures/Social.js");
const { get } = require("snekfetch");

class Penguin extends Social {
  constructor(...args) {
    super(...args, {
      name: "penguin",
      description: "Post a randomly selected image of a penguin.",
      category: "Animals",
      usage: "penguin",
      extended: "This command will return a beautiful penguin.",
      cost: 5,
      cooldown: 10,
      aliases: ["pengu"],
      loadingString: "<a:typing:397490442469376001> **{{displayName}}** is petting a penguin...",
      botPerms: ["EMBED_LINKS"]
    });
  }

  async run(message, args, level, loadingMessage) {
    const { body } = await get("https://animals.anidiots.guide/penguin");
    await loadingMessage.edit({
      embed: {
        "title": "Click here if the image failed to load.",
        "url": body.link,
        "color": 6192321,
        "image": {
          "url": body.link
        },
        "footer": {
          "icon_url": message.author.displayAvatarURL({ format: "png", size: 32 }),
          "text": `Requested by ${message.author.tag} | Powered by An Idiot's API`
        }
      }
    });
  }
}

module.exports = Penguin;