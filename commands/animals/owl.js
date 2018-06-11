const Social = require("../../structures/Social.js");
const { get } = require("snekfetch");

class Owl extends Social {
  constructor(...args) {
    super(...args, {
      name: "owl",
      description: "Post a randomly selected image of a owl.",
      category: "Animals",
      usage: "owl",
      extended: "This command will return a beautiful owl.",
      cost: 5,
      cooldown: 10,
      aliases: ["hoot"],
      loadingString: "<a:typing:397490442469376001> **{{displayName}}** is petting an owl...",
      botPerms: ["EMBED_LINKS"]
    });
  }

  async run(message, args, level, loadingMessage) {
    const owl = await get("http://pics.floofybot.moe/owl").then(r => r.body.image); // API Provided by Lewdcario
    await loadingMessage.edit({
      embed: {
        "title": "Click here if the image failed to load.",
        "url": owl,
        "color": 6192321,
        "image": {
          "url": owl
        }
      }
    });
  }
}

module.exports = Owl;