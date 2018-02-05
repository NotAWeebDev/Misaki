const Social = require(`${process.cwd()}/base/Social.js`);
const snekfetch = require("snekfetch");

class Gtn extends Social {
  constructor(client) {
    super(client, {
      name: "gtn",
      description: "Displays a random comic by GreenTeaNeko",
      usage: "gtn",
      category: "NSFW",
      cost: 5,
    });
  }

  async run(message, args, level) { // eslint-disable-line no-unused-vars
    try {
      if (!message.channel.nsfw) return message.response("🔞", "Cannot display NSFW content in a SFW channel.");

      if (message.settings.socialSystem === "true") {
        if (!(await this.cmdPay(message, message.author.id, this.help.cost))) return;
      }
      const msg = await message.channel.send(`<a:typing:397490442469376001> **${message.member.displayName}** wants to read a comic...`);
      const { body } = await snekfetch.get("https://rra.ram.moe/i/r?type=nsfw-gtn&nsfw=true");
      await msg.edit({
        embed: {
          "title": "Click here if the image failed to load.",
          "url": `https://cdn.ram.moe/${body.path.replace("/i/", "")}`,
          "color": message.guild.me.roles.highest.color || 5198940,
          "image": {
            "url": `https://cdn.ram.moe/${body.path.replace("/i/", "")}`
          }
        }
      });
    } catch (e) {
      console.log(e);
    }

  }
}

module.exports = Gtn;
