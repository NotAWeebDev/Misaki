const Social = require(`${process.cwd()}/base/Social.js`);

class Tickle extends Social {
  constructor(client) {
    super(client, {
      name: "tickle",
      description: "Someone needs a tickle",
      usage: "tickle",
      category: "Fun",
      extended: "",
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
      const msg = await message.channel.send(`<a:typing:397490442469376001> **${message.member.displayName}** goes to tickle **${target.first().displayName}**...`);
      const tickle = await this.cmdMoe("tickle");
      await message.buildEmbed()
        .setDescription(`**${target.first().displayName}**, you just got tickled by **${message.member.displayName}**`)
        .setColor(message.guild.member(this.client.user.id).highestRole.color || 0)
        .setImage(`https://cdn.ram.moe/${tickle}`)
        .setTimestamp()
        .send();

      await msg.delete();
    } catch (e) {
      console.log(e);
    }

  }
}

module.exports = Tickle;
