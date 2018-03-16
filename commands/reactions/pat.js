const Social = require("../../base/Social.js");

class Pat extends Social {
  constructor(...args) {
    super(...args, {
      name: "pat",
      description: "Someone needs a pat",
      usage: "pat <@mention>",
      category: "Reactions",
      cost: 5,
      loadingString: "<a:typing:397490442469376001> **{{displayName}}** wants to pat someone..."
    });
  }

  cmdVerify(message, args, loadingMessage) {
    const target = message.mentions.members;
    if (!target) return Promise.reject(new this.client.methods.errors.UsageError("You need to mention someone to pat them.", loadingMessage));
    if (message.member === target.first()) return Promise.reject(new this.client.methods.errors.UsageError("You cannot pat yourself!", loadingMessage));
    return Promise.resolve(target);
  }

  async run(message, args, level, loadingMessage) {
    const target = await this.cmdVerify(message, args, loadingMessage);
    const pat = await this.cmdWeeb("pat", "gif", message.channel.nsfw);
    await loadingMessage.edit({
      embed: {
        "title": "Click here if the image failed to load.",
        "url": pat,
        "description": `**${target.first().displayName}**, you got pats from **${message.member.displayName}**`,
        "color": message.guild.me.roles.highest.color || 5198940,
        "image": {
          "url": pat
        }
      }
    });
  }
}

module.exports = Pat;
