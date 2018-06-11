const Social = require("../../structures/Social.js");

class Banghead extends Social {
  constructor(...args) {
    super(...args, {
      name: "banghead",
      description: "AAARGHHH!",
      usage: "banghead",
      category: "Reactions",
      cost: 5,
      loadingString: "<a:typing:397490442469376001> **{{displayName}}** thinks a palm isn't enough.",
      botPerms: ["EMBED_LINKS"]
    });
  }

  async run(message, args, level, loadingMessage) {
    const banghead = await this.cmdWeeb("banghead", "gif", message.channel.nsfw);
    await loadingMessage.edit({
      embed: {
        "title": "Click here if the image failed to load.",
        "url": banghead,
        "color": 6192321,
        "image": {
          "url": banghead
        },
        "footer": {
          "icon_url": message.author.displayAvatarURL({ format: "png", size: 32 }),
          "text": `Requested by ${message.author.tag} | Powered by weeb.sh`
        }
      }
    });

  }
}

module.exports = Banghead;
