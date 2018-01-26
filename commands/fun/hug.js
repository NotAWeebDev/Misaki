const Social = require(`${process.cwd()}/base/Social.js`);

class Hug extends Social {
  constructor(client) {
    super(client, {
      name: "hug",
      description: "Someone needs a hug",
      usage: "hug",
      category: "Fun",
      cost: 5,
      aliases: ["glomp"]
    });
  }

  async run(message, args, level) { // eslint-disable-line no-unused-vars
    const target = message.mentions.members;
    if (target.size === 0) return message.response(undefined, "You need to mention someone to send them a hug.");
    try {
      if (message.settings.socialSystem === "true") {
        if (!(await this.cmdPay(message, message.author.id, this.help.cost))) return;
      }
      const msg = await message.channel.send(`<a:typing:397490442469376001> **${message.member.displayName}** wants to give **${target.first().displayName}** a big hug...`);
      const hug = await this.cmdMoe("hug");
      await msg.edit({
        embed: {
          "title": "Click here if the image failed to load",
          "url": `https://cdn.ram.moe/${hug}`,
          "description": `**${target.first().displayName}**, you just got hugged by **${message.member.displayName}**`,
          "color": message.guild.member(this.client.user.id).highestRole.color || 5198940,
          "image": {
            "url": `https://cdn.ram.moe/${hug}`
          }
        }
      });
    } catch (e) {
      console.log(e);
    }

  }
}

module.exports = Hug;
