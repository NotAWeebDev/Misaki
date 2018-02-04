const Social = require(`${process.cwd()}/base/Social.js`);

class Potato extends Social {
  constructor(client) {
    super(client, {
      name: "potato",
      description: "Someone needs a potato",
      usage: "potato",
      category: "Fun",
      cost: 5,
      aliases: ["spud"]
    });
  }

  async run(message, args, level) { // eslint-disable-line no-unused-vars
    if (message.settings.socialSystem === "true") {
      if (!(await this.cmdPay(message, message.author.id, this.help.cost))) return;
    }
    const msg = await message.channel.send(`<a:typing:397490442469376001> **${message.member.displayName}** is a potato...`);
    const potato = await this.cmdMoe("potato");
    await msg.edit({
      embed: {
        "title": "Click here if the image failed to load.",
        "url": `https://cdn.ram.moe/${potato}`,
        "color": message.guild.me.roles.highest.color || 5198940,
        "image": {
          "url": `https://cdn.ram.moe/${potato}`
        }
      }
    });

  }
}

module.exports = Potato;
