const Social = require(`${process.cwd()}/base/Social.js`);
const snek = require("snekfetch");
class Dog extends Social {
  constructor(client) {
    super(client, {
      name: "dog",
      description: "Post a randomly selected image of a dog.",
      category: "Animals",
      usage: "dog",
      extended: "This command will return a beautiful dog.",
      cooldown: 10,
      guildOnly: true,
      aliases: ["doggo", "pupper"]
    });
  }

  async run(message, args, level) { // eslint-disable-line no-unused-vars
    try {
      const url = args[0] ? `https://dog.ceo/api/breed/${args[0]}/images/random` : "https://dog.ceo/api/breeds/image/random";

      if (!(await this.cmdPay(message, message.author.id, this.help.cost))) return;

      const msg = await message.channel.send(`<a:typing:397490442469376001> **${message.member.displayName}** is petting a dog...`);
      const { body } = await snek.get(url);
      message.buildEmbed()
        .setImage(body.message)
        .setTimestamp()
        .send();

      await msg.delete();
    } catch (e) {
      console.log(e);
    }
  }
}

module.exports = Dog;