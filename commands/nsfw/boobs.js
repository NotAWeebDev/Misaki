const Social = require(`${process.cwd()}/base/Social.js`);
const snekfetch = require("snekfetch");

class Boobs extends Social {
  constructor(client) {
    super(client, {
      name: "boobs",
      description: "Show me boobies!!!",
      category: "NSFW",
      usage: "boobs",
      extended: "This command will return boobs.",
      cost: 40,
      cooldown: 10,
      aliases: ["breasts","jugs","cans","knockers","bongos","bubbies","bumpers","bewbz","tits","tatas","chesticles","gazongas","titties","headlamps","honkburgers","jubblies","mankillers","melons"]
    });
  }

  async run(message, args, level) { // eslint-disable-line no-unused-vars
    try {
      if (!message.channel.nsfw) return message.response("🔞", "Cannot display NSFW content in a SFW channel.");

      if (message.settings.socialSystem === "true") {
        if (!(await this.cmdPay(message, message.author.id, this.help.cost))) return;
      }

      const msg = await message.channel.send(`<a:typing:397490442469376001> **${message.member.displayName}** is looking for boobies...`);
      const { body } = await snekfetch.get("http://api.oboobs.ru/boobs/0/1/random");
      await msg.edit({
        embed: {
          "title": "Click here if the image failed to load.",
          "url": `http://media.oboobs.ru/${body[0].preview}`,
          "color": message.guild.me.roles.highest.color || 5198940,
          "image": {
            "url": `http://media.oboobs.ru/${body[0].preview}`
          }
        }
      });
    } catch (e) {
      console.log(e);
    }
  }
}

module.exports = Boobs;