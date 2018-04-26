const Social = require("../../structures/Social.js");
const { get } = require("snekfetch");

class Duck extends Social {
  constructor(...args) {
    super(...args, {
      name: "duck",
      description: "Post a randomly selected image of a duck.",
      category: "Animals",
      usage: "duck",
      extended: "This command will return a beautiful duck.",
      cost: 5,
      cooldown: 10,
      aliases: [],
      loadingString: "<a:typing:397490442469376001> **{{displayName}}** is petting a duck...",
      botPerms: ["EMBED_LINKS"]
    });
  }

  async run(message, args, level, loadingMessage) { 
    const { body } = await get("https://random-d.uk/api/v1/random?type=gif");
    return loadingMessage.edit({
      embed: {
        "title": "Click here if the image failed to load.",
        "url": body.url,
        "color": 6192321,
        "image": {
          "url": body.url
        },
        "footer": {
          "icon_url": message.author.displayAvatarURL({ size: 32 }),
          "text": `Requested by: ${message.author.tag} | ${body.message}`
        },
      }
    });
  }
}

module.exports = Duck;