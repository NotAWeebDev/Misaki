const Meme = require("../../base/Meme.js");

class Everywhere extends Meme {
  constructor(...args) {
    super(...args, {
      name: "everywhere",
      description: "X, X Everywhere",
      usage: "everywhere <first text ; second text>",
      category: "meme",
      cost: 5,
      aliases: ["buzz"]
    });
  }

  async run(message, args, level) { // eslint-disable-line no-unused-vars
    const text = args.join(" ");
    if (text.length < 5) return message.response(undefined, `Invalid Command usage: \`${this.help.usage}\``);
    const msg = await message.channel.send(`<a:typing:397490442469376001> **${message.member.displayName}** looks around them...`);
    const meme = await this.twoMeme(347390, text);
    await msg.edit({
      embed: {
        "title": "Click here if the image failed to load.",
        "url": meme,
        "color": message.guild.me.roles.highest.color || 5198940,
        "image": {
          "url": meme
        },
        "footer": {
          "icon_url": message.author.displayAvatarURL(),
          "text": `Requested by ${message.member.displayName}`
        },
      }
    });
  }
}
module.exports = Everywhere;