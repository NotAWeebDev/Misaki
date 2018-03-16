const Social = require("../../base/Social.js");

class Poke extends Social {
  constructor(...args) {
    super(...args, {
      name: "poke",
      description: "Just want to poke someone.",
      usage: "poke <@mention>",
      category: "Reactions",
      cost: 5,
      loadingString: "<a:typing:397490442469376001> **{{displayName}}** wants to poke someone."
    });
  }

  cmdVerify(message, args, loadingMessage) {
    const target = message.mentions.members;
    if (!target.size) return Promise.reject(new this.client.methods.errors.UsageError("You need to mention someone to poke them.", loadingMessage));
    if (message.member === target.first()) return Promise.reject(new this.client.methods.errors.UsageError("You cannot poke yourself!", loadingMessage));
    return Promise.resolve(target);
  }

  async run(message, args, level, loadingMessage) { // eslint-disable-line no-unused-vars
    const target = await this.cmdVerify(message, args, loadingMessage);
    const poke = await this.cmdWeeb("poke", "gif", message.channel.nsfw);
    await loadingMessage.edit({
      embed: {
        "title": "Click here if the image failed to load.",
        "url": poke,
        "description": `**${target.first().displayName}**, you just got poked by **${message.member.displayName}**`,
        "color": message.guild.me.roles.highest.color || 5198940,
        "image": {
          "url": poke
        }
      }
    });

  }
}

module.exports = Poke;
