const Social = require(`${process.cwd()}/base/Social.js`);

class Nom extends Social {
  constructor(client) {
    super(client, {
      name: "nom",
      description: "Someone needs a nom",
      usage: "nom <@mention>",
      category: "Reactions",
      cost: 5,
    });
  }

  async run(message, args, level) { // eslint-disable-line no-unused-vars
    const target = message.mentions.members;
    if (target.size === 0) return message.response(undefined, "You need to mention someone to nom on them.");
    if (message.member == target.first()) return message.response(undefined, "You cannot nom yourself!");
    try {
      if (message.settings.socialSystem === "true") {
        if (!(await this.cmdPay(message, message.author.id, this.help.cost))) return;
      }
      const msg = await message.channel.send(`<a:typing:397490442469376001> **${message.member.displayName}** wants to nom on **${target.first().displayName}**...`);
      const nom = await this.cmdWeeb("nom", "gif", message.channel.nsfw);
      await msg.edit({
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
    } catch (e) {
      console.log(e);
    }

  }
}

module.exports = Nom;
