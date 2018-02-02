const Social = require(`${process.cwd()}/base/Social.js`);

class Pout extends Social {
  constructor(client) {
    super(client, {
      name: "pout",
      description: "Someone needs a pout",
      usage: "pout",
      category: "Reactions",
      cost: 5,
      aliases: []
    });
  }

  async run(message, args, level) { // eslint-disable-line no-unused-vars
    try {
      if (message.settings.socialSystem === "true") {
        if (!(await this.cmdPay(message, message.author.id, this.help.cost))) return;
      }
      const msg = await message.channel.send(`<a:typing:397490442469376001> **${message.member.displayName}** is pouting...`);
      const pout = await this.cmdMoe("pout");
      await msg.edit({
        embed: {
          "title": "Click here if the image failed to load.",
          "url": `https://cdn.ram.moe/${pout}`,
          "color": message.guild.me.roles.highest.color || 5198940,
          "image": {
            "url": `https://cdn.ram.moe/${pout}`
          }
        }
      });
    } catch (e) {
      console.log(e);
    }

  }
}

module.exports = Pout;
