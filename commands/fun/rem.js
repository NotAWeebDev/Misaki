const Social = require("../../structures/Social.js");
const { get } = require("snekfetch");

class Rem extends Social {
  constructor(...args) {
    super(...args, {
      name: "rem",
      description: "Someone needs rem",
      usage: "rem",
      category: "Fun",
      cost: 5,
      loadingString: "<a:typing:397490442469376001> **{{displayName}}** wants rem..."
    });
  }

  async run(message, args, level, loadingMessage) { // eslint-disable-line no-unused-vars
    const { body } = await get("https://rra.ram.moe/i/r?type=rem");
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

module.exports = Rem;
