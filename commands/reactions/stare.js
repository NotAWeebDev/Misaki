const Social = require(`${process.cwd()}/base/Social.js`);

class Stare extends Social {
  constructor(client) {
    super(client, {
      name: "stare",
      description: "Just stare at them...",
      usage: "stare <@mention>",
      category: "Reactions",
      cost: 5,
    });
  }

  async run(message, args, level) { // eslint-disable-line no-unused-vars
    const target = message.mentions.members;
    if (target.size === 0) return message.response(undefined, "You need to mention someone to stare at them.");
    if (message.member == target.first()) return message.response(undefined, "You want to stare at yourself ?");
    try {
      if (message.settings.socialSystem === "true") {
        if (!(await this.cmdPay(message, message.author.id, this.help.cost))) return;
      }
      const msg = await message.channel.send(`<a:typing:397490442469376001> **${message.member.displayName}** starts staring at **${target.first().displayName}**...`);
      const stare = await this.cmdWeeb("stare", "gif", message.channel.nsfw);
      await msg.edit({
        embed: {
          "title": "Click here if the image failed to load.",
          "url": stare,
          "description": `**${message.member.displayName}** is staring at **${target.first().displayName}**.`,
          "color": message.guild.me.roles.highest.color || 5198940,
          "image": {
            "url": stare
          }
        }
      });
    } catch (e) {
      console.log(e);
    }

  }
}

module.exports = Stare;
