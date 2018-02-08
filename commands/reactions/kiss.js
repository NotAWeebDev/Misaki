const Social = require(`${process.cwd()}/base/Social.js`);

class Kiss extends Social {
  constructor(client) {
    super(client, {
      name: "kiss",
      description: "Someone needs a kiss",
      usage: "kiss <@mention>",
      category: "Reactions",
      cost: 5,
    });
  }

  async run(message, args, level) { // eslint-disable-line no-unused-vars
    const target = message.mentions.members;
    if (target.size === 0) return message.response(undefined, "You need to mention someone to kiss them.");
    if (message.member == target.first()) return message.response(undefined, "You cannot kiss yourself !");
    try {
      if (message.settings.socialSystem === "true") {
        if (!(await this.cmdPay(message, message.author.id, this.help.cost))) return;
      }
      const msg = await message.channel.send(`<a:typing:397490442469376001> **${message.member.displayName}** wants to give **${target.first().displayName}** a kiss...`);
      const kiss = await this.cmdWeeb("kiss", "gif", message.channel.nsfw);
      await msg.edit({
        embed: {
          "title": "Click here if the image failed to load.",
          "url": kiss,
          "description": `**${target.first().displayName}**, you just got a kiss from **${message.member.displayName}**`,
          "color": message.guild.me.roles.highest.color || 5198940,
          "image": {
            "url": kiss
          }
        }
      });
    } catch (e) {
      console.log(e);
    }

  }
}

module.exports = Kiss;
