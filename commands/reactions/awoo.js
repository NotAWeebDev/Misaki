const Social = require("../../structures/Social.js");

class Awoo extends Social {
  constructor(...args) {
    super(...args, {
      name: "awoo",
      description: "AAARGHHH!",
      usage: "awoo",
      category: "Reactions",
      cost: 5,
      loadingString: "<a:typing:397490442469376001> **{{displayName}}** goes awooooo.",
      botPerms: ["EMBED_LINKS"]
    });
  }

  cmdVerify(message, args, loadingMessage) {
    const target = message.mentions.members;
    if (target.size === 0) return Promise.reject(new this.client.methods.errors.UsageError("You need to mention someone to awoo them.", loadingMessage));
    if (message.member === target.first()) return Promise.reject(new this.client.methods.errors.UsageError("You cannot awoo yourself!", loadingMessage));
    return Promise.resolve(target);
  }

  async run(message, args, level, loadingMessage) {
    const target = await this.cmdVerify(message, args, loadingMessage);    
    const awoo = await this.cmdWeeb("awoo", "gif", message.channel.nsfw);
    await loadingMessage.edit({
      embed: {
        "title": "Click here if the image failed to load.",
        "url": awoo,
        "description": `**${target.first().displayName}**, you just got **awoo**'d by **${message.member.displayName}**`,
        "color": 6192321,
        "image": {
          "url": awoo
        },
        "footer": {
          "icon_url": message.author.displayAvatarURL({ format: "png", size: 32 }),
          "text": `Requested by ${message.author.tag} | Powered by weeb.sh`
        }
      }
    });

  }
}

module.exports = Awoo;
