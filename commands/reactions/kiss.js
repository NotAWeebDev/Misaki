const Social = require("../../structures/Social.js");

class Kiss extends Social {
  constructor(...args) {
    super(...args, {
      name: "kiss",
      description: "Someone needs a kiss",
      usage: "kiss <@mention>",
      category: "Reactions",
      cost: 5,
      loadingString: "<a:typing:397490442469376001> **{{displayName}}** wants to give a kiss...",
      botPerms: ["EMBED_LINKS"]
    });
  }

  cmdVerify(message, args, loadingMessage) {
    const target = message.mentions.members;
    if (target.size === 0) return Promise.reject(new this.client.methods.errors.UsageError("You need to mention someone to kiss them.", loadingMessage));
    if (message.member === target.first()) return Promise.reject(new this.client.methods.errors.UsageError("You cannot kiss yourself!", loadingMessage));
    return Promise.resolve(target);
  }

  async run(message, args, level, loadingMessage) {
    const target = await this.cmdVerify(message, args, loadingMessage);
    const kiss = await this.cmdWeeb("kiss", "gif", message.channel.nsfw);
    await loadingMessage.edit({
      embed: {
        "title": "Click here if the image failed to load.",
        "url": kiss,
        "description": `**${target.first().displayName}**, you just got a kiss from **${message.member.displayName}**`,
        "color": 6192321,
        "image": {
          "url": kiss
        },
        "footer": {
          "icon_url": message.author.displayAvatarURL({ format: "png", size: 32 }),
          "text": `Requested by ${message.author.tag} | Powered by weeb.sh`
        }
      }
    });
  }
}

module.exports = Kiss;
