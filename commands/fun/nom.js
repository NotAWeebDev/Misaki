const Social = require(`${process.cwd()}/base/Social.js`);

class Nom extends Social {
  constructor(client) {
    super(client, {
      name: "nom",
      description: "Someone needs a nom",
      usage: "nom",
      category: "Fun",
      cost: 5,
      aliases: []
    });
  }

  async run(message, args, level) { // eslint-disable-line no-unused-vars
    const target = message.mentions.members;
    if (target.size === 0) return message.response(undefined, "You need to mention someone to nom on them.");
    try {
      if (message.settings.socialSystem === "true") {
        if (!(await this.cmdPay(message, message.author.id, this.help.cost))) return;
      }
      const msg = await message.channel.send(`<a:typing:397490442469376001> **${message.member.displayName}** wants to nom on **${target.first().displayName}**...`);
      const nom = await this.cmdMoe("nom");
      await message.buildEmbed()
        .setDescription(`**${target.first().displayName}**, you just got nom'ed by **${message.member.displayName}**`)
        .setColor(message.guild.member(this.client.user.id).highestRole.color || 0)
        .setImage(`https://cdn.ram.moe/${nom}`)
        .setTimestamp()
        .send();

      await msg.delete();
    } catch (e) {
      console.log(e);
    }

  }
}

module.exports = Nom;
