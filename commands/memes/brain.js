const Meme = require(`${process.cwd()}/base/Meme.js`);
const { UsageError } = require(`${process.cwd()}/util/CustomError.js`); 

class Brain extends Meme {
  constructor(client) {
    super(client, {
      name: "brain",
      description: "Blow your mind",
      usage: "brain <first text ; second text ; third text ; forth text>",
      category: "meme",
      cost: 5,
      loadignString: "<a:typing:397490442469376001> **{{displayName}}** reveals their inner knowledge..."
    });
  }

  cmdVerify(message, args, loadingMessage) {
    const text = args.join(" ");
    if (text.length === 0) return Promise.reject(new UsageError("You must supply test to think about!", loadingMessage));
    return Promise.resolve(text);
  }

  async run(message, args, level, loadingMessage) {
    const text = await this.cmdVerify(message, args, loadingMessage);
    const meme = await this.fourMeme(93895088, text);
    await loadingMessage.edit({
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
module.exports = Brain;
