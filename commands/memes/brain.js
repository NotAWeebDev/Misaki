const Meme = require(`${process.cwd()}/base/Meme.js`);

class Brain extends Meme {
  constructor(client) {
    super(client, {
      name: "brain",
      description: "Blow your mind",
      usage: "brain <first text ; second text ; third text ; forth text>",
      category: "meme",
      cost: 5,
      aliases: []
    });
  }

  async run(message, args, level) { // eslint-disable-line no-unused-vars
    const text = args.join(" ");
    const msg = await message.channel.send(`**${message.member.displayName}** reveals their inner knowledge...`);

    await message.buildEmbed()
      .setColor(message.guild.member(this.client.user.id).highestRole.color || 0)
      .setImage(await this.fourMeme(93895088, text))
      .setFooter(`Requested by ${message.member.displayName}`, message.author.displayAvatarURL())
      .setTimestamp()
      .send();
    await msg.delete();

  }
}
module.exports = Brain;