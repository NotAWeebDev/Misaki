const Social = require("../../structures/Social.js");
const { get } = require("snekfetch");
class Nyan extends Social {
  constructor(...args) {
    super(...args, {
      name: "nyan",
      description: "Someone needs a nyan in their life.",
      usage: "nyan",
      category: "Reactions",
      cost: 5,
      loadingString: "<a:typing:397490442469376001> **{{displayName}}** wants a nyan...",
      botPerms: ["EMBED_LINKS"]
    });
  }

  async run(message, args, level, loadingMessage) { // eslint-disable-line no-unused-vars
    const { body } = await get("https://rra.ram.moe/i/r?type=nyan");
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
          "text": `Requested by ${message.author.tag} | Powered by weeb.sh`
        }
      }
    });

  }
}

module.exports = Nyan;
