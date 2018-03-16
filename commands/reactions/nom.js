const Social = require(`${process.cwd()}/base/Social.js`);

class Nom extends Social {
  constructor(...args) {
    super(...args, {
      name: "nom",
      description: "Someone needs a nom",
      usage: "nom <@mention>",
      category: "Reactions",
      cost: 5,
      loadingString: "<a:typing:397490442469376001> **{{displayName}}** wants to nom on someone..."
    });
  }

  cmdVerify(message, args, loadingMessage) {
    const target = message.mentions.members;
    if (!target.size) return Promise.reject(new this.client.methods.errors.UsageError("You need to mention someone to nom on them.", loadingMessage));
    if (message.member == target.first()) return Promise.reject(new this.client.methods.errors.UsageError("You cannot nom yourself!", loadingMessage));
    return Promise.resolve(target);
  }

  async run(message, args, level, loadingMessage) {
    const target = await this.cmdVerify(message, args, loadingMessage);
    const nom = await this.cmdWeeb("nom", "gif", message.channel.nsfw);
    await loadingMessage.edit({
      embed: {
        "title": "Click here if the image failed to load.",
        "url": nom,
        "description": `**${target.first().displayName}**, you just got nom'ed by **${message.member.displayName}**`,
        "color": message.guild.me.roles.highest.color || 5198940,
        "image": {
          "url": nom
        }
      }
    });

  }
}

module.exports = Nom;
