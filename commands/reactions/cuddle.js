const Social = require(`${process.cwd()}/base/Social.js`);

class Cuddle extends Social {
  constructor(client) {
    super(client, {
      name: "cuddle",
      description: "Just want to cuddle",
      usage: "cuddle <@mention>",
      category: "Reactions",
      cost: 5,
    });
  }

  async run(message, args, level) { // eslint-disable-line no-unused-vars
    const target = message.mentions.members;
    if (target.size === 0) return message.response(undefined, "You need to mention someone to cuddle them.");
    if (message.member == target.first()) return message.response(undefined, "You cannot cuddle yourself !");
    try {
      if (message.settings.socialSystem === "true") {
        if (!(await this.cmdPay(message, message.author.id, this.help.cost))) return;
      }
      const msg = await message.channel.send(`<a:typing:397490442469376001> **${message.member.displayName}** wants to give **${target.first().displayName}** a loving cuddle...`);
      const cuddle = await this.cmdWeeb("cuddle", "gif", message.channel.nsfw);
      await msg.edit({
        embed: {
          "title": "Click here if the image failed to load.",
          "url": cuddle,
          "description": `**${target.first().displayName}**, you just got cuddled by **${message.member.displayName}**`,
          "color": message.guild.me.roles.highest.color || 5198940,
          "image": {
            "url": cuddle
          }
        }
      });
    } catch (e) {
      console.log(e);
    }

  }
}

module.exports = Cuddle;
