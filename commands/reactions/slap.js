const Social = require("../../structures/Social.js");

class Slap extends Social {
  constructor(...args) {
    super(...args, {
      name: "slap",
      description: "When someone's good enough to eat.",
      usage: "slap <@mention>",
      category: "Reactions",
      cost: 5,
      loadingString: "<a:typing:397490442469376001> **{{displayName}}** thinks someone needs a smack...",
      botPerms: ["EMBED_LINKS"]
    });
  }

  cmdVerify(message, args, loadingMessage) {
    const target = message.mentions.members;
    if (target.size === 0) return Promise.reject(new this.client.methods.errors.UsageError("You need to mention someone to slap.", loadingMessage));
    if (message.member === target.first()) return Promise.reject(new this.client.methods.errors.UsageError("You cannot slap yourself!", loadingMessage));
    return Promise.resolve(target);
  }

  async run(message, args, level, loadingMessage) { // eslint-disable-line no-unused-vars
    const target = await this.cmdVerify(message, args, loadingMessage);
    const slap = await this.cmdWeeb("slap", "gif", message.channel.nsfw);
    await loadingMessage.edit({
      embed: {
        "title": "Click here if the image failed to load.",
        "url": slap,
        "description": `OMG **${target.first().displayName}**, you just got slapped by **${message.member.displayName}**`,
        "color": 6192321,
        "image": {
          "url": slap
        },
        "footer": {
          "icon_url": message.author.displayAvatarURL({ format: "png", size: 32 }),
          "text": `Requested by ${message.author.tag} | Powered by weeb.sh`
        }
      }
    });
  }
}

module.exports = Slap;
