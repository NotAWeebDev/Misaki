const Social = require(`${process.cwd()}/base/Social.js`);

class Blush extends Social {
  constructor(client) {
    super(client, {
      name: "blush",
      description: "Someone needs a blush",
      usage: "blush <@mention>",
      category: "Reactions",
      cost: 5,
    });
  }

  async run(message, args, level) { // eslint-disable-line no-unused-vars
    const target = message.mentions.members;
    if (target.size === 0) return message.response(undefined, "You need to mention someone to blush at.");
    try {
      if (message.settings.socialSystem === "true") {
        if (!(await this.cmdPay(message, message.author.id, this.help.cost))) return;
      }
      const msg = await message.channel.send(`<a:typing:397490442469376001> **${message.member.displayName}** feels their face going red...`);
      const blush = await this.cmdWeeb("blush", "gif", message.channel.nsfw);
      await msg.edit({
        embed: {
          "title": "Click here if the image failed to load.",
          "url": blush,
          "description": `**${message.member.displayName}** goes red at the sight of **${target.first().displayName}**.`,
          "color": message.guild.me.roles.highest.color || 5198940,
          "image": {
            "url": blush
          }
        }
      });
    } catch (e) {
      console.log(e);
    }

  }
}

module.exports = Blush;
