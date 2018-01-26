const Social = require(`${process.cwd()}/base/Social.js`);
const snek = require("snekfetch");
class Owl extends Social {
  constructor(client) {
    super(client, {
      name: "owl",
      description: "Post a randomly selected image of a owl.",
      category: "Animals",
      usage: "owl",
      extended: "This command will return a beautiful owl.",
      cost: 5,
      cooldown: 10,
      aliases: []
    });
  }

  async run(message, args, level) { // eslint-disable-line no-unused-vars
    try {

      if (message.settings.socialSystem === "true") {
        if (!(await this.cmdPay(message, message.author.id, this.help.cost))) return;
      }

      const msg = await message.channel.send(`<a:typing:397490442469376001> **${message.member.displayName}** is petting an owl...`);
      const { body } = await snek.get("http://pics.floofybot.moe/owl");// API Provided by Lewdcario
      await message.buildEmbed()
        .setImage(body.image)
        .setTimestamp()
        .send();

      await msg.delete();
    } catch (e) {
      console.log(e);
    }
  }
}

module.exports = Owl;