const Social = require("../../structures/Social.js");

class Pout extends Social {
  constructor(...args) {
    super(...args, {
      name: "pout",
      description: "Someone needs a pout",
      usage: "pout",
      category: "Reactions",
      cost: 5,
      loadingString: "<a:typing:397490442469376001> **{{displayName}}** is pouting...",
      botPerms: ["EMBED_LINKS"]
    });
  }

  async run(message, args, level, loadingMessage) { // eslint-disable-line no-unused-vars
    const pout = await this.cmdWeeb("pout", "gif", message.channel.nsfw);
    await loadingMessage.edit({
      embed: {
        "title": "Click here if the image failed to load.",
        "url": pout,
        "color": 6192321,
        "image": {
          "url": pout
        },
        "footer": {
          "icon_url": message.author.displayAvatarURL({ format: "png", size: 32 }),
          "text": `Requested by ${message.author.tag} | Powered by weeb.sh`
        }
      }
    });
  }
}

module.exports = Pout;
