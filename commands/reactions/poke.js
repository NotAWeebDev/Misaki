const Social = require(`${process.cwd()}/base/Social.js`);

class Poke extends Social {
  constructor(client) {
    super(client, {
      name: "poke",
      description: "Just want to poke someone.",
      usage: "poke <@mention>",
      category: "Reactions",
      cost: 5,
    });
  }

  async run(message, args, level) { // eslint-disable-line no-unused-vars
    const target = message.mentions.members;
    if (target.size === 0) return message.response(undefined, "You need to mention someone to poke them.");
    try {
      if (message.settings.socialSystem === "true") {
        if (!(await this.cmdPay(message, message.author.id, this.help.cost))) return;
      }
      const msg = await message.channel.send(`<a:typing:397490442469376001> **${message.member.displayName}** wants to poke **${target.first().displayName}**.`);
      const poke = await this.cmdWeeb("poke", "gif", message.channel.nsfw);
      await msg.edit({
        embed: {
          "title": "Click here if the image failed to load.",
          "url": poke,
          "description": `**${target.first().displayName}**, you just got poked by **${message.member.displayName}**`,
          "color": message.guild.me.roles.highest.color || 5198940,
          "image": {
            "url": poke
          }
        }
      });
    } catch (e) {
      console.log(e);
    }

  }
}

module.exports = Poke;
