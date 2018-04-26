const Social = require("../../structures/Social.js");
const { get } = require("snekfetch");

class Potato extends Social {
  constructor(...args) {
    super(...args, {
      name: "potato",
      description: "Someone needs a potato",
      usage: "potato",
      category: "Fun",
      cost: 5,
      aliases: ["spud"],
      loadingString: "<a:typing:397490442469376001> **{{displayName}}** is a potato..."
    });
  }

  async run(message, args, level, loadingMessage) { // eslint-disable-line no-unused-vars
    const { body } = await get("https://rra.ram.moe/i/r?type=potato");
    await loadingMessage.edit({
      embed: {
        "title": "Click here if the image failed to load.",
        "url": `https://cdn.ram.moe/${body.path.replace("/i/", "")}`,
        "color": 6192321,
        "image": {
          "url": `https://cdn.ram.moe/${body.path.replace("/i/", "")}`
        },
        "footer": {
          "icon_url": message.author.displayAvatarURL({ format: "png", size: 32 }),
          "text": `Requested by ${message.author.tag} | Powered by Weeb.sh`
        }
      }
    });

  }
}

module.exports = Potato;
