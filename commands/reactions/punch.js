const Social = require(`${process.cwd()}/base/Social.js`);

class Punch extends Social {
  constructor(client) {
    super(client, {
      name: "punch",
      description: "Someone needs a punch",
      usage: "punch <@mention>",
      category: "Reactions",
      cost: 5,
    });
  }

  async run(message, args, level) { // eslint-disable-line no-unused-vars
    const target = message.mentions.members;
    if (target.size === 0) return message.response(undefined, "You need to mention someone to punch them.");
    try {
      if (message.settings.socialSystem === "true") {
        if (!(await this.cmdPay(message, message.author.id, this.help.cost))) return;
      }
      const msg = await message.channel.send(`<a:typing:397490442469376001> **${message.member.displayName}** wants to punch **${target.first().displayName}**...`);
      const punch = await this.cmdWeeb("punch", "gif", message.channel.nsfw);
      await msg.edit({
        embed: {
          "title": "Click here if the image failed to load.",
          "url": punch,
          "description": `**${target.first().displayName}**, you just got punched by **${message.member.displayName}**`,
          "color": message.guild.me.roles.highest.color || 5198940,
          "image": {
            "url": punch
          }
        }
      });
    } catch (e) {
      console.log(e);
    }

  }
}

module.exports = Punch;
