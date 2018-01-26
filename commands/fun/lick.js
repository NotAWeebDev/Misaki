const Social = require(`${process.cwd()}/base/Social.js`);

class Lick extends Social {
  constructor(client) {
    super(client, {
      name: "lick",
      description: "Someone needs a lick",
      usage: "lick",
      category: "Fun",
      cost: 5,
      aliases: []
    });
  }

  async run(message, args, level) { // eslint-disable-line no-unused-vars
    const target = message.mentions.members;
    if (target.size === 0) return message.response(undefined, "You need to mention someone to lick them.");
    try {
      if (message.settings.socialSystem === "true") {
        if (!(await this.cmdPay(message, message.author.id, this.help.cost))) return;
      }
      const msg = await message.channel.send(`<a:typing:397490442469376001> **${message.member.displayName}** wants to lick **${target.first().displayName}**...`);
      const lick = await this.cmdMoe("lick");
      await msg.edit({
        embed: {
          "title": "Click here if the image failed to load.",
          "url": `https://cdn.ram.moe/${lick}`,
          "description": `**${target.first().displayName}**, you just got licked by **${message.member.displayName}**`,
          "color": message.guild.member(this.client.user.id).highestRole.color || 5198940,
          "image": {
            "url": `https://cdn.ram.moe/${lick}`
          }
        }
      });
    } catch (e) {
      console.log(e);
    }

  }
}

module.exports = Lick;
