const Social = require(`${process.cwd()}/base/Social.js`);

class Stare extends Social {
  constructor(client) {
    super(client, {
      name: "stare",
      description: "Someone needs a stare",
      usage: "stare",
      category: "Fun",
      extended: "",
      cost: 5,
      aliases: ["glomp"]
    });
  }

  async run(message, args, level) { // eslint-disable-line no-unused-vars
    try {
      if (message.settings.socialSystem === "true") {
        if (!(await this.cmdPay(message, message.author.id, this.help.cost))) return;
      }
      const msg = await message.channel.send(`<a:typing:397490442469376001> **${message.member.displayName}** wants a big stare...`);
      const stare = await this.cmdMoe("stare");
      await message.buildEmbed()
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
