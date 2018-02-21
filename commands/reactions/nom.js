const Social = require(`${process.cwd()}/base/Social.js`);
const { UsageError } = require(`${process.cwd()}/util/CustomError.js`);

class Nom extends Social {
  constructor(client) {
    super(client, {
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
    if (target.size === 0) return Promise.reject(new UsageError("You need to mention someone to nom on them.", loadingMessage));
    if (message.member == target.first()) return Promise.reject(new UsageError("You cannot nom yourself!", loadingMessage));
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
