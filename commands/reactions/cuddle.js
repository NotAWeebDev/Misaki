const Social = require("../../base/Social.js");

class Cuddle extends Social {
  constructor(...args) {
    super(...args, {
      name: "cuddle",
      description: "Just want to cuddle",
      usage: "cuddle <@mention>",
      category: "Reactions",
      cost: 5,
    });
  }

  cmdVerify(message, args, loadingMessage) {
    const target = message.mentions.members;
    if (target.size === 0) return Promise.reject(new this.client.methods.errors.UsageError("You need to mention someone to cry on their shoulder.", loadingMessage));
    if (message.member == target.first()) return Promise.reject(new this.client.methods.errors.UsageError("You cannot cry on yourself!", loadingMessage));
    return Promise.resolve(target);
  }

  async run(message, args, level) { // eslint-disable-line no-unused-vars
    const target = message.mentions.members;
    if (!target.size) return message.response(undefined, "You need to mention someone to cuddle them.");
    if (message.member == target.first()) return message.reponse(undefined, "You cannot cuddle yourself !");
    const msg = await message.channel.send(`<a:typing:397490442469376001> **${message.member.displayName}** wants to give **${target.first().displayName}** a loving cuddle...`);
    const cuddle = await this.cmdWeeb("cuddle", "gif", message.channel.nsfw);
    await msg.edit({
      embed: {
        "title": "Click here if the image failed to load.",
        "url": cuddle,
        "description": `**${target.first().displayName}**, you just got cuddled by **${message.member.displayName}**`,
        "color": message.guild.me.roles.highest.color || 5198940,
        "image": {
          "url": cuddle
        }
      }
    });

  }
}

module.exports = Cuddle;
