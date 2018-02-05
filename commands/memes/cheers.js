const Meme = require(`${process.cwd()}/base/Meme.js`);

class Cheers extends Meme {
  constructor(client) {
    super(client, {
      name: "cheers",
      description: "Say cheers with Leonardo DiCaprio!",
      usage: "cheers <top text ; bottom text>",
      category: "meme",
      cost: 5,
    });
  }

  async run(message, args, level) { // eslint-disable-line no-unused-vars
    const text = args.join(" ");
    if (text.length < 5) return message.response(undefined, `Invalid Command usage: \`${this.help.usage}\``);
    try {
      if (message.settings.socialSystem === "true") {
        if (!(await this.cmdPay(message, message.author.id, this.help.cost))) return;
      }
      const msg = await message.channel.send(`<a:typing:397490442469376001> **${message.member.displayName}** raises their glass...`);
      const meme = await this.twoMeme(5496396, text);
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
module.exports = Cheers;