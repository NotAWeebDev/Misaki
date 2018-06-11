const Social = require("../../structures/Social.js");

class HoldHand extends Social {
  constructor(...args) {
    super(...args, {
      name: "holdhand",
      description: "Someone needs their hand held.",
      usage: "holdhand <@mention>",
      category: "Reactions",
      cost: 5,
      loadingString: "<a:typing:397490442469376001> **{{displayName}}** reaches out for you...",
      botPerms: ["EMBED_LINKS"]
    });
  }

  cmdVerify(message, args, loadingMessage) {
    const target = message.mentions.members;
    if (target.size === 0) return Promise.reject(new this.client.methods.errors.UsageError("You need to mention someone to hold hands with them.", loadingMessage));
    if (message.member === target.first()) return Promise.reject(new this.client.methods.errors.UsageError("You cannot hold your own hands, well you could but it would be weird!", loadingMessage));
    return Promise.resolve(target);
  }

  async run(message, args, level, loadingMessage) {
    const target = await this.cmdVerify(message, args, loadingMessage);    
    const holdhand = await this.cmdWeeb("handholding", "gif", message.channel.nsfw);
    await loadingMessage.edit({
      embed: {
        "title": "Click here if the image failed to load.",
        "url": holdhand,
        "description": `**${target.first().displayName}** and **${message.member.displayName}** are holding hands... LEWD!`,
        "color": 6192321,
        "image": {
          "url": holdhand
        },
        "footer": {
          "icon_url": message.author.displayAvatarURL({ format: "png", size: 32 }),
          "text": `Requested by ${message.author.tag} | Powered by weeb.sh`
        }
      }
    });

  }
}

module.exports = HoldHand;
