const Social = require("../../base/Social.js");

class Banghead extends Social {
  constructor(...args) {
    super(...args, {
      name: "banghead",
      description: "AAARGHHH!",
      usage: "banghead",
      category: "Reactions",
      cost: 5,
      loadingString: "<a:typing:397490442469376001> **{{displayName}}** thinks a palm isn't enough."
    });
  }

  async run(message, args, level, loadingMessage) {
    const banghead = await this.cmdWeeb("banghead", "gif", message.channel.nsfw);
    await loadingMessage.edit({
      embed: {
        "title": "Click here if the image failed to load.",
        "url": banghead,
        "color": message.guild.me.roles.highest.color || 5198940,
        "image": {
          "url": banghead
        }
      }
    });

  }
}

module.exports = Banghead;
