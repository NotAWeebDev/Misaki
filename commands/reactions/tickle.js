const Social = require(`${process.cwd()}/base/Social.js`);

class Tickle extends Social {
  constructor(client) {
    super(client, {
      name: "tickle",
      description: "Someone needs a good tickle",
      usage: "tickle <@mention>",
      category: "Reactions",
      cost: 5,
    });
  }

  async run(message, args, level) { // eslint-disable-line no-unused-vars
    const target = message.mentions.members;
    if (target.size === 0) return message.response(undefined, "You need to mention someone to tickle them.");
    if (message.member == target.first()) return message.response(undefined, "You cannot tickle yourself !");
    try {
      if (message.settings.socialSystem === "true") {
        if (!(await this.cmdPay(message, message.author.id, this.help.cost))) return;
      }
      const msg = await message.channel.send(`<a:typing:397490442469376001> **${message.member.displayName}** goes to tickle **${target.first().displayName}**...`);
      const tickle = await this.cmdWeeb("tickle", "gif", message.channel.nsfw);
      await msg.edit({
        embed: {
          "title": "Click here if the image failed to load.",
          "url": tickle,
          "description": `**${target.first().displayName}**, you just got tickled by **${message.member.displayName}**`,
          "color": message.guild.me.roles.highest.color || 5198940,
          "image": {
            "url": tickle
          }
        }
      });
    } catch (e) {
      console.log(e);
    }

  }
}

module.exports = Tickle;
