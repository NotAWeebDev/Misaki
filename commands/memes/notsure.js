const Meme = require(`${process.cwd()}/base/Meme.js`);

class Notsure extends Meme {
  constructor(client) {
    super(client, {
      name: "notsure",
      description: "Express your indecision with Philip J Fry!",
      usage: "notsure <top text ; bottom text>",
      category: "meme",
      cost: 5,
      aliases: ["fry"]
    });
  }

  async run(message, args, level) { // eslint-disable-line no-unused-vars
    const text = args.join(" ");
    if (text.length < 5) return message.response(undefined, `Invalid Command usage: \`${this.help.usage}\``);
    const msg = await message.channel.send(`<a:typing:397490442469376001> **${message.member.displayName}** isn't sure...`);

    message.buildEmbed()
      .setColor(message.guild.member(this.client.user.id).highestRole.color || 0)
      .setImage(await this.twoMeme(61520, text))
      .setFooter(`Requested by ${message.member.displayName}`, message.author.displayAvatarURL())
      .setTimestamp()
      .send();
    await msg.delete();
  }
}
module.exports = Notsure;