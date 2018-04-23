const Social = require("../../../structures/Social.js");
const { get } = require("snekfetch");

class Neko extends Social {
  constructor(...args) {
    super(...args, {
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
    if (!message.channel.nsfw) return message.response("🔞", "Cannot display NSFW content in a SFW channel.");

    const msg = await message.channel.send(`<a:typing:397490442469376001> **${message.member.displayName}** is looking for a feline...`);
    const { body } = await get("https://nekos.life/api/v2/img/lewd");
    await msg.edit({
      embed: {
        "title": "Click here if the image failed to load.",
        "url": body.url,
        "color": message.guild ? message.guild.me.roles.highest.color : 5198940,
        "image": {
          "url": body.url
        },
        "footer": {
          "icon_url": message.author.displayAvatarURL({ format: "png", size: 32 }),
          "text": `Requested by ${message.author.tag} | Powered by Nekos.life API`
        }
      }
    });
  }
}

module.exports = Neko;