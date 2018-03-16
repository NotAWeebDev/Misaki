const Social = require("../../base/Social.js");

class Tickle extends Social {
  constructor(...args) {
    super(...args, {
      name: "tickle",
      description: "Someone needs a good tickle",
      usage: "tickle <@mention>",
      category: "Reactions",
      cost: 5,
      loadingString: "<a:typing:397490442469376001> **{{displayName}}** goes to tickle someone..."
    });
  }

  cmdVerify(message, args, loadingMessage) {
    const target = message.mentions.members;
    if (target.size === 0) return Promise.reject(new this.client.methods.errors.UsageError("You need to mention someone to tickle them.", loadingMessage));
    if (message.member === target.first()) return Promise.reject(new this.client.methods.errors.UsageError("You cannot tickle yourself!", loadingMessage));
    return Promise.resolve(target);
  }

  async run(message, args, level, loadingMessage) {
    const target = await this.cmdVerify(message, args, loadingMessage);
    const tickle = await this.cmdWeeb("tickle", "gif", message.channel.nsfw);
    await loadingMessage.edit({
      embed: {
        "title": "Click here if the image failed to load.",
        "url": tickle,
        "description": `**${target.first().displayName}**, you just got tickled by **${message.member.displayName}**`,
        "color": message.guild.me.roles.highest.color || 5198940,
        "image": {
          "url": tickle
        }
      }
    });
  }
}

module.exports = Tickle;
