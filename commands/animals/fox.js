const Social = require("../../structures/Social.js");
const { get } = require("snekfetch");

class Fox extends Social {
  constructor(...args) {
    super(...args, {
      name: "fox",
      description: "Post a randomly selected image of a fox.",
      category: "Animals",
      usage: "fox",
      extended: "This command will return a beautiful fox.",
      cost: 5,
      cooldown: 10,
      aliases: [],
      loadingString: "<a:typing:397490442469376001> **{{displayName}}** is petting a fox...",
      botPerms: ["EMBED_LINKS"]
    });
  }

  async run(message, args, level, loadingMessage) {
    const { body } = await get("https://randomfox.ca/floof/");
    await loadingMessage.edit({
      embed: {
        "title": "Click here if the image failed to load.",
        "url": body.link,
        "color": 6192321,
        "image": {
          "url": body.image
        }
      }
    });

  }
}

module.exports = Fox;