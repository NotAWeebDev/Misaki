const Social = require(`${process.cwd()}/base/Social.js`);

class Smug extends Social {
  constructor(client) {
    super(client, {
      name: "smug",
      description: "Someone feels a bit smug.",
      usage: "smug",
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
      const msg = await message.channel.send(`<a:typing:397490442469376001> **${message.member.displayName}** is feeling smug...`);
      const smug = await this.cmdMoe("smug");
      await message.buildEmbed()
        .setColor(message.guild.member(this.client.user.id).highestRole.color || 0)
        .setImage(`https://cdn.ram.moe/${smug}`)
        .setTimestamp()
        .send();

      await msg.delete();
    } catch (e) {
      console.log(e);
    }

  }
}

module.exports = Smug;
