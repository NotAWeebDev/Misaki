const Social = require(`${process.cwd()}/base/Social.js`);

class Stare extends Social {
  constructor(client) {
    super(client, {
      name: "stare",
      description: "Someone needs a stare",
      usage: "stare",
      category: "Fun",
      cost: 5,
      aliases: ["glomp"]
    });
  }

  async run(message, args, level) { // eslint-disable-line no-unused-vars
    const target = message.mentions.members;
    if (target.size === 0) return message.response(undefined, "You need to mention someone to send them a hug.");
    try {
      if (message.settings.socialSystem === "true") {
        if (!(await this.cmdPay(message, message.author.id, this.help.cost))) return;
      }
      const msg = await message.channel.send(`<a:typing:397490442469376001> **${message.member.displayName}** starts staring at **${target.first().displayName}**...`);
      const stare = await this.cmdMoe("stare");
      await message.buildEmbed()
        .setDescription(`**${message.member.displayName}** is staring at **${target.first().displayName}**.`)
        .setColor(message.guild.member(this.client.user.id).highestRole.color || 0)
        .setImage(`https://cdn.ram.moe/${stare}`)
        .setTimestamp()
        .send();

      await msg.delete();
    } catch (e) {
      console.log(e);
    }

  }
}

module.exports = Stare;
