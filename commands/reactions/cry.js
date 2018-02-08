const Social = require(`${process.cwd()}/base/Social.js`);

class Cry extends Social {
  constructor(client) {
    super(client, {
      name: "cry",
      description: "For when you just can't keep it in.",
      usage: "cry <@mention>",
      category: "Reactions",
      cost: 5,
    });
  }

  async run(message, args, level) { // eslint-disable-line no-unused-vars
    const target = message.mentions.members;
    if (target.size === 0) return message.response(undefined, "You need to mention someone to cry on their shoulder.");
    if (message.member == target.first()) return message.response(undefined, "You cannot cry on yourself !");
    try {
      if (message.settings.socialSystem === "true") {
        if (!(await this.cmdPay(message, message.author.id, this.help.cost))) return;
      }
      const msg = await message.channel.send(`<a:typing:397490442469376001> **${message.member.displayName}** wants to cry it all away...`);
      const cry = await this.cmdWeeb("cry", "gif", message.channel.nsfw);
      await msg.edit({
        embed: {
          "title": "Click here if the image failed to load.",
          "url": cry,
          "description": `**${target.first().displayName}**, **${message.member.displayName}** just cried on your shoulder.`,
          "color": message.guild.me.roles.highest.color || 5198940,
          "image": {
            "url": cry
          }
        }
      });

    } catch (e) {
      console.log(e);
    }

  }
}

module.exports = Cry;
