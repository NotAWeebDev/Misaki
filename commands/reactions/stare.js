const Social = require("../../base/Social.js");

class Stare extends Social {
  constructor(...args) {
    super(...args, {
      name: "stare",
      description: "Just stare at them...",
      usage: "stare <@mention>",
      category: "Reactions",
      cost: 5,
      loadingString: "<a:typing:397490442469376001> **{{displayName}}** starts staring at someone..."
    });
  }

  cmdVerify(message, args, loadingMessage) {
    const target = message.mentions.members;
    if (target.size === 0) return Promise.reject(new this.client.methods.errors.UsageError("You need to mention someone to stare at them.", loadingMessage));
    if (message.member == target.first()) return Promise.reject(new this.client.methods.errors.UsageError("You cannot stare at yourself!", loadingMessage));
    return Promise.resolve(target);
  }

  async run(message, args, level, loadingMessage) {
    const target = await this.cmdVerify(message, args, loadingMessage);
    const stare = await this.cmdWeeb("stare", "gif", message.channel.nsfw);
    await loadingMessage.edit({
      embed: {
        "title": "Click here if the image failed to load.",
        "url": stare,
        "description": `**${message.member.displayName}** is staring at **${target.first().displayName}**.`,
        "color": message.guild.me.roles.highest.color || 5198940,
        "image": {
          "url": stare
        }
      }
    });
  }
}

module.exports = Stare;
