const Meme = require(`${process.cwd()}/base/Meme.js`);

class Scroll extends Meme {
  constructor(client) {
    super(client, {
      name: "scroll",
      description: "Discover the scroll of truth!",
      usage: "scroll <text>",
      category: "meme",
      cost: 5,
      aliases: []
    });
  }

  async run(message, args, level) { // eslint-disable-line no-unused-vars
    const text = args.join(" ");
    if (text.length < 5) return message.response(undefined, `Invalid Command usage: \`${this.help.usage}\``);
    const msg = await message.channel.send(`<a:typing:397490442469376001> **${message.member.displayName}** discovers the scroll of truth...`);
    message.buildEmbed()
      .setColor(message.guild.member(this.client.user.id).highestRole.color || 0)
      .setImage(await this.twoMeme(123999232, text))
      .setFooter(`Requested by ${message.member.displayName}`, message.author.displayAvatarURL())
      .setTimestamp()
      .send();
    await msg.delete();
  }
}
module.exports = Scroll;