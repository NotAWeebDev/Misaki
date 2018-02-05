const Social = require(`${process.cwd()}/base/Social.js`);

class Rem extends Social {
  constructor(client) {
    super(client, {
      name: "rem",
      description: "Someone needs rem",
      usage: "rem",
      category: "Fun",
      cost: 5,
    });
  }

  async run(message, args, level) { // eslint-disable-line no-unused-vars
    if (message.settings.socialSystem === "true") {
      if (!(await this.cmdPay(message, message.author.id, this.help.cost))) return;
    }
    const msg = await message.channel.send(`<a:typing:397490442469376001> **${message.member.displayName}** wants rem...`);
    const rem = await this.cmdMoe("rem");
    await msg.edit({
      embed: {
        "title": "Click here if the image failed to load.",
        "url": `https://cdn.ram.moe/${rem}`,
        "color": message.guild.me.roles.highest.color || 5198940,
        "image": {
          "url": `https://cdn.ram.moe/${rem}`
        }
      }
    });

  }
}

module.exports = Rem;
