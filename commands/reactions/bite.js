const Social = require(`${process.cwd()}/base/Social.js`);

class Bite extends Social {
  constructor(client) {
    super(client, {
      name: "bite",
      description: "Someone needs a bite",
      usage: "bite <@mention>",
      category: "Reactions",
      cost: 5,
    });
  }

  async run(message, args, level) { // eslint-disable-line no-unused-vars
    const target = message.mentions.members;
    if (target.size === 0) return message.response(undefined, "You need to mention someone to bite them.");
    try {
      if (message.settings.socialSystem === "true") {
        if (!(await this.cmdPay(message, message.author.id, this.help.cost))) return;
      }
      const msg = await message.channel.send(`<a:typing:397490442469376001> **${message.member.displayName}** wants to sink their teeth into **${target.first().displayName}**...`);
      const bite = await this.cmdWeeb("bite", "gif", message.channel.nsfw);
      await msg.edit({
        embed: {
          "title": "Click here if the image failed to load.",
          "url": bite,
          "description": `**${target.first().displayName}**, you just got bitten by **${message.member.displayName}**`,
          "color": message.guild.me.roles.highest.color || 5198940,
          "image": {
            "url": bite
          }
        }
      });
    } catch (e) {
      console.log(e);
    }

  }
}

module.exports = Bite;
