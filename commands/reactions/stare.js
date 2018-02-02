const Social = require(`${process.cwd()}/base/Social.js`);

class Stare extends Social {
  constructor(client) {
    super(client, {
      name: "stare",
      description: "Just stare at them...",
      usage: "stare <@mention>",
      category: "Reactions",
      cost: 5,
      aliases: ["glomp"]
    });
  }

  async run(message, args, level) { // eslint-disable-line no-unused-vars
    const target = message.mentions.members;
    if (target.size === 0) return message.response(undefined, "You need to mention someone to stare at them.");
    try {
      if (message.settings.socialSystem === "true") {
        if (!(await this.cmdPay(message, message.author.id, this.help.cost))) return;
      }
      const msg = await message.channel.send(`<a:typing:397490442469376001> **${message.member.displayName}** starts staring at **${target.first().displayName}**...`);
      const stare = await this.cmdMoe("stare");
      await msg.edit({
        embed: {
          "title": "Click here if the image failed to load.",
          "url": `https://cdn.ram.moe/${stare}`,
          "description": `**${message.member.displayName}** is staring at **${target.first().displayName}**.`,
          "color": message.guild.me.roles.highest.color || 5198940,
          "image": {
            "url": `https://cdn.ram.moe/${stare}`
          }
        }
      });
    } catch (e) {
      console.log(e);
    }

  }
}

module.exports = Stare;
