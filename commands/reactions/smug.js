const Social = require("../../structures/Social.js");

class Smug extends Social {
  constructor(...args) {
    super(...args, {
      name: "smug",
      description: "Someone feels a bit smug.",
      usage: "smug",
      category: "Reactions",
      cost: 5,
      loadingString: "<a:typing:397490442469376001> **{{displayName}}** is feeling smug...",
      botPerms: ["EMBED_LINKS"]
    });
  }

  async run(message, args, level, loadingMessage) {
    const smug = await this.cmdWeeb("smug", "gif", message.channel.nsfw);
    await loadingMessage.edit({
      embed: {
        "title": "Click here if the image failed to load.",
        "url": smug,
        "color": 6192321,
        "image": {
          "url": smug
        },
        "footer": {
          "icon_url": message.author.displayAvatarURL({ format: "png", size: 32 }),
          "text": `Requested by ${message.author.tag} | Powered by weeb.sh`
        }
      }
    });
  }
}

module.exports = Smug;
