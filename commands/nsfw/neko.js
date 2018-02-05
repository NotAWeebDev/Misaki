const Social = require(`${process.cwd()}/base/Social.js`);
const snekfetch = require("snekfetch");

class Neko extends Social {
  constructor(client) {
    super(client, {
      name: "neko",
      description: "Shows a picture of a neko.",
      category: "NSFW",
      usage: "neko",
      extended: "This command will return a Neko, a lewd Neko if used in a NSFW channel",
      cost: 40,
      cooldown: 10,
    });
  }

  async run(message, args, level) { // eslint-disable-line no-unused-vars
    try {
      if (!message.channel.nsfw) return message.response("🔞", "Cannot display NSFW content in a SFW channel.");

      if (message.settings.socialSystem === "true") {
        if (!(await this.cmdPay(message, message.author.id, this.help.cost))) return;
      }

      const msg = await message.channel.send(`<a:typing:397490442469376001> **${message.member.displayName}** is looking for a feline...`);
      const { body } = await snekfetch.get(`https://nekos.life/api${Math.random() >= 0.5 ? "/lewd" : ""}/neko`);
      await msg.edit({
        embed: {
          "title": "Click here if the image failed to load.",
          "url": body.neko,
          "color": message.guild.me.roles.highest.color || 5198940,
          "image": {
            "url": body.neko
          }
        }
      });
    } catch (e) {
      console.log(e);
    }
  }
}

module.exports = Neko;