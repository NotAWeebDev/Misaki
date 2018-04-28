const Social = require("../../structures/Social.js");

class Gun extends Social {
  constructor(...args) {
    super(...args, {
      name: "gun",
      description: "AAARGHHH!",
      usage: "gun",
      category: "Reactions",
      cost: 5,
      loadingString: "<a:typing:397490442469376001> **{{displayName}}** needs a bigger gun.",
      botPerms: ["EMBED_LINKS"]
    });
  }

  async run(message, args, level, loadingMessage) { // eslint-disable-line no-unused-vars
    const bang = await this.cmdWeeb("bang", "gif", message.channel.nsfw);
    await loadingMessage.edit({
      embed: {
        "title": "Click here if the image failed to load.",
        "url": bang,
        "color": 6192321,
        "image": {
          "url": bang
        },
        "footer": {
          "icon_url": message.author.displayAvatarURL({ format: "png", size: 32 }),
          "text": `Requested by ${message.author.tag} | Powered by weeb.sh`
        }
      }
    });
  }
}

module.exports = Gun;
