const Social = require(`${process.cwd()}/base/Social.js`);
const snek = require("snekfetch");
class Bunny extends Social {
  constructor(client) {
    super(client, {
      name: "bunny",
      description: "Post a randomly selected image of a bunny.",
      category: "Animals",
      usage: "bunny",
      extended: "This command will return a beautiful bunny.",
      cooldown: 10,
      guildOnly: true,
      aliases: []
    });
  }

  async run(message, args, level) { // eslint-disable-line no-unused-vars
    try {

      if (!(await this.cmdPay(message, message.author.id, this.help.cost))) return;

      const msg = await message.channel.send(`<a:typing:397490442469376001> **${message.member.displayName}** is petting a bunny...`);
      const { body } = await snek.get("https://api.bunnies.io/v2/loop/random/?media=gif,png");
      message.buildEmbed()
        .setImage(body.media.poster)
        .setTimestamp()
        .send();

      await msg.delete();
    } catch (e) {
      console.log(e);
    }
  }
}

module.exports = Bunny;