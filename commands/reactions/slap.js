const Social = require(`${process.cwd()}/base/Social.js`);

class Slap extends Social {
  constructor(client) {
    super(client, {
      name: "slap",
      description: "When someone's good enough to eat.",
      usage: "slap <@mention>",
      category: "Reactions",
      cost: 5,
    });
  }

  async run(message, args, level) { // eslint-disable-line no-unused-vars
    const target = message.mentions.members;
    if (target.size === 0) return message.response(undefined, "You need to mention someone to slap them.");
    try {
      if (message.settings.socialSystem === "true") {
        if (!(await this.cmdPay(message, message.author.id, this.help.cost))) return;
      }
      const msg = await message.channel.send(`<a:typing:397490442469376001> **${message.member.displayName}** wants to slap **${target.first().displayName}**...`);
      const slap = await this.cmdWeeb("slap", "gif", message.channel.nsfw);
      await msg.edit({
        embed: {
          "title": "Click here if the image failed to load.",
          "url": slap,
          "description": `OMG **${target.first().displayName}**, you just got slapped by **${message.member.displayName}**`,
          "color": message.guild.me.roles.highest.color || 5198940,
          "image": {
            "url": slap
          }
        }
      });
    } catch (e) {
      console.log(e);
    }

  }
}

module.exports = Slap;
