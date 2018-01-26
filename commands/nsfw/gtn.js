const Social = require(`${process.cwd()}/base/Social.js`);

class Gtn extends Social {
  constructor(client) {
    super(client, {
      name: "gtn",
      description: "Displays a random comic by GreenTeaNeko",
      usage: "gtn",
      category: "NSFW",
      cost: 5,
      aliases: []
    });
  }

  async run(message, args, level) { // eslint-disable-line no-unused-vars
    try {
      if (!message.channel.nsfw) return message.response("🔞", "Cannot display NSFW content in a SFW channel.");

      if (message.settings.socialSystem === "true") {
        if (!(await this.cmdPay(message, message.author.id, this.help.cost))) return;
      }
      const msg = await message.channel.send(`<a:typing:397490442469376001> **${message.member.displayName}** wants to read a comic...`);
      const gtn = await this.cmdMoe("nsfw-gtn", true);
      await msg.edit({
        embed: {
          "title": "Click here if the image failed to load",
          "url": `https://cdn.ram.moe/${gtn}`,
          "color": message.guild.member(this.client.user.id).highestRole.color || 5198940,
          "image": {
            "url": `https://cdn.ram.moe/${gtn}`
          }
        }
      });
    } catch (e) {
      console.log(e);
    }

  }
}

module.exports = Gtn;
