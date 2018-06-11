const Social = require("../../structures/Social.js");
const { get } = require("snekfetch");

class Boobs extends Social {
  constructor(...args) {
    super(...args, {
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
    if (!message.channel.nsfw) return message.response("🔞", "Cannot display NSFW content in a SFW channel.");
    const msg = await message.channel.send(`<a:typing:397490442469376001> **${message.member.displayName}** is looking for boobies...`);
    const { body } = await get("http://api.oboobs.ru/boobs/0/1/random");
    await msg.edit({
      embed: {
        "title": "Click here if the image failed to load.",
        "url": `http://media.oboobs.ru/${body[0].preview}`,
        "color": 6192321,
        "image": {
          "url": `http://media.oboobs.ru/${body[0].preview}`
        },
        "footer": {
          "icon_url": message.author.displayAvatarURL({ format: "png", size: 32 }),
          "text": `Requested by ${message.author.tag} | Powered by oboobs.ru`
        }
      }
    });
  }
}

module.exports = Boobs;