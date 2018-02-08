const Social = require(`${process.cwd()}/base/Social.js`);

class Pat extends Social {
  constructor(client) {
    super(client, {
      name: "pat",
      description: "Someone needs a pat",
      usage: "pat <@mention>",
      category: "Reactions",
      cost: 5,
    });
  }

  async run(message, args, level) { // eslint-disable-line no-unused-vars
    const target = message.mentions.members;
    if (target.size === 0) return message.response(undefined, "You need to mention someone to pat them.");
    if (message.member == target.first()) return message.response(undefined, "You cannot pat yourself !");
    try {
      if (message.settings.socialSystem === "true") {
        if (!(await this.cmdPay(message, message.author.id, this.help.cost))) return;
      }
      const msg = await message.channel.send(`<a:typing:397490442469376001> **${message.member.displayName}** wants to pat **${target.first().displayName}**...`);
      const pat = await this.cmdWeeb("pat", "gif", message.channel.nsfw);
      await msg.edit({
        embed: {
          "title": "Click here if the image failed to load.",
          "url": pat,
          "description": `**${target.first().displayName}**, you got pats from **${message.member.displayName}**`,
          "color": message.guild.me.roles.highest.color || 5198940,
          "image": {
            "url": pat
          }
        }
      });
    } catch (e) {
      console.log(e);
    }

  }
}

module.exports = Pat;
