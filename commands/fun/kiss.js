const Social = require(`${process.cwd()}/base/Social.js`);

class Kiss extends Social {
  constructor(client) {
    super(client, {
      name: "kiss",
      description: "Someone needs a kiss",
      usage: "kiss",
      category: "Fun",
      cost: 5,
      aliases: []
    });
  }

  async run(message, args, level) { // eslint-disable-line no-unused-vars
    const target = message.mentions.members;
    if (target.size === 0) return message.response(undefined, "You need to mention someone to kiss them.");
    try {
      if (message.settings.socialSystem === "true") {
        if (!(await this.cmdPay(message, message.author.id, this.help.cost))) return;
      }
      const msg = await message.channel.send(`<a:typing:397490442469376001> **${message.member.displayName}** wants to give **${target.first().displayName}** a kiss...`);
      const kiss = await this.cmdMoe("kiss");
      await msg.edit({
        embed: {
          "title": "Click here if the image failed to load.",
          "url": `https://cdn.ram.moe/${kiss}`,
          "description": `**${target.first().displayName}**, you just got a kiss from **${message.member.displayName}**`,
          "color": message.guild.me.roles.highest.color || 5198940,
          "image": {
            "url": `https://cdn.ram.moe/${kiss}`
          }
        }
      });
    } catch (e) {
      console.log(e);
    }

  }
}

module.exports = Kiss;
