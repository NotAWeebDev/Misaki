const Social = require(`${process.cwd()}/base/Social.js`);

class Hug extends Social {
  constructor(client) {
    super(client, {
      name: "hug",
      description: "Give someone a hug.",
      usage: "hug <@mention>",
      category: "Reactions",
      cost: 5,
    });
  }

  async run(message, args, level) { // eslint-disable-line no-unused-vars
    const target = message.mentions.members;
    if (target.size === 0) return message.response(undefined, "You need to mention someone to send them a hug.");
    if (message.member == target.first()) return message.response(undefined, "You cannot hug yourself !");
    try {
      if (message.settings.socialSystem === "true") {
        if (!(await this.cmdPay(message, message.author.id, this.help.cost))) return;
      }
      const msg = await message.channel.send(`<a:typing:397490442469376001> **${message.member.displayName}** wants to give **${target.first().displayName}** a big hug...`);
      const hug = await this.cmdWeeb("hug", "gif", message.channel.nsfw);
      await msg.edit({
        embed: {
          "title": "Click here if the image failed to load.",
          "url": hug,
          "description": `**${target.first().displayName}**, you just got hugged by **${message.member.displayName}**`,
          "color": message.guild.me.roles.highest.color || 5198940,
          "image": {
            "url": hug
          }
        }
      });
    } catch (e) {
      console.log(e);
    }

  }
}

module.exports = Hug;
