const Social = require("../../base/Social.js");

class Blush extends Social {
  constructor(...args) {
    super(...args, {
      name: "blush",
      description: "Someone needs a blush",
      usage: "blush <@mention>",
      category: "Reactions",
      cost: 5,
      loadingString: "<a:typing:397490442469376001> **{{displayName}}** feels their face going red..."
    });
  }

  cmdVerify(message, args, loadingMessage) {
    const target = message.mentions.members;
    if (target.size === 0) return Promise.reject(new this.client.methods.errors.UsageError("You need to mention someone to blush at.", loadingMessage));
    if (message.member == target.first()) return Promise.reject(new this.client.methods.errors.UsageError("You cannot blush at yourself!", loadingMessage));
    return Promise.resolve(target);
  }

  async run(message, args, level, loadingMessage) {
    const target = await this.cmdVerify(message, args, loadingMessage);
    const blush = await this.cmdWeeb("blush", "gif", message.channel.nsfw);
    await loadingMessage.edit({
      embed: {
        "title": "Click here if the image failed to load.",
        "url": blush,
        "description": `**${message.member.displayName}** goes red at the sight of **${target.first().displayName}**.`,
        "color": message.guild.me.roles.highest.color || 5198940,
        "image": {
          "url": blush
        }
      }
    });
  }
}

module.exports = Blush;
