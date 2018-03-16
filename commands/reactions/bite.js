const Social = require("../../base/Social.js");

class Bite extends Social {
  constructor(...args) {
    super(...args, {
      name: "bite",
      description: "Someone needs a bite",
      usage: "bite <@mention>",
      category: "Reactions",
      cost: 5,
      loadingString: "<a:typing:397490442469376001> **{{displayName}}** wants to sink their teeth into people..."
    });
  }

  cmdVerify(message, args, loadingMessage) {
    const target = message.mentions.members;
    if (!target.size) return Promise.reject(new this.client.methods.errors.UsageError("You need to mention someone to bite them.", loadingMessage));
    if (message.member == target.first()) return Promise.reject(new this.client.methods.errors.UsageError("You cannot bite yourself!", loadingMessage));
    return Promise.resolve(target);
  }

  async run(message, args, level, loadingMessage) {
    const target = await this.cmdVerify(message, args, loadingMessage);    
    const bite = await this.cmdWeeb("bite", "gif", message.channel.nsfw);
    await loadingMessage.edit({
      embed: {
        "title": "Click here if the image failed to load.",
        "url": bite,
        "description": `**${target.first().displayName}**, you just got bitten by **${message.member.displayName}**`,
        "color": message.guild.me.roles.highest.color || 5198940,
        "image": {
          "url": bite
        }
      }
    });

  }
}

module.exports = Bite;
