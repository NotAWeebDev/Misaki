const Social = require("../../base/Social.js");

class Smug extends Social {
  constructor(...args) {
    super(...args, {
      name: "smug",
      description: "Someone feels a bit smug.",
      usage: "smug",
      category: "Reactions",
      cost: 5,
      loadingString: "<a:typing:397490442469376001> **{{displayName}}** is feeling smug..."
    });
  }

  async run(message, args, level, loadingMessage) {
    const smug = await this.cmdWeeb("smug", "gif", message.channel.nsfw);
    await loadingMessage.edit({
      embed: {
        "title": "Click here if the image failed to load.",
        "url": smug,
        "color": message.guild.me.roles.highest.color || 5198940,
        "image": {
          "url": smug
        }
      }
    });
  }
}

module.exports = Smug;
