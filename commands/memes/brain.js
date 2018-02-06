const Meme = require(`${process.cwd()}/base/Meme.js`);

class Brain extends Meme {
  constructor(client) {
    super(client, {
      name: "brain",
      description: "Blow your mind",
      usage: "brain <first text ; second text ; third text ; forth text>",
      category: "meme",
      cost: 5,
    });
  }

  async run(message, args, level) { // eslint-disable-line no-unused-vars
    const text = args.join(" ");
    if (text.length === 0) return message.response("❗", "You must supply test to think about!");
    try {
      if (message.settings.socialSystem === "true") {
        if (!(await this.cmdPay(message, message.author.id, this.help.cost))) return;
      }
      const msg = await message.channel.send(`<a:typing:397490442469376001> **${message.member.displayName}** reveals their inner knowledge...`);
      const meme = await this.fourMeme(93895088, text);
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
    } catch (error) {
      console.log(error);
    }
  }
}
module.exports = Brain;
