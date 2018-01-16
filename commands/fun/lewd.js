const Social = require(`${process.cwd()}/base/Social.js`);

class Lewd extends Social {
  constructor(client) {
    super(client, {
      name: "lewd",
      description: "Someone needs a lewd",
      usage: "lewd",
      category: "Fun",
      cost: 5,
      aliases: []
    });
  }

  async run(message, args, level) { // eslint-disable-line no-unused-vars
    const target = message.mentions.members;
    let response = "this";
    if (target.size !== 0) response = `**${target.first().displayName}**`;
    try {
      if (message.settings.socialSystem === "true") {
        if (!(await this.cmdPay(message, message.author.id, this.help.cost))) return;
      }
      const msg = await message.channel.send(`<a:typing:397490442469376001> **${message.member.displayName}** thinks ${response} is a bit lewd...`);
      const lewd = await this.cmdMoe("lewd");
      await message.buildEmbed()
        .setDescription(`**${message.member.displayName}** thinks ${response} is a bit lewd.`)
        .setColor(message.guild.member(this.client.user.id).highestRole.color || 0)
        .setImage(`https://cdn.ram.moe/${lewd}`)
        .setTimestamp()
        .send();

      await msg.delete();
    } catch (e) {
      console.log(e);
    }

  }
}

module.exports = Lewd;
