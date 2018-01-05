const Social = require(`${process.cwd()}/base/Social.js`);
const snek = require("snekfetch");
class Cat extends Social {
  constructor(client) {
    super(client, {
      name: "cat",
      description: "Post a randomly selected image of a cat.",
      category: "Animals",
      usage: "cat",
      extended: "This command will return a beautiful cat.",
      cooldown: 10,
      guildOnly: true,
      aliases: ["kitten"]
    });
  }

  async run(message, args, level) { // eslint-disable-line no-unused-vars
    try {

      if (!(await this.cmdPay(message, message.author.id, this.help.cost, this.conf.botPerms))) return;

      const msg = await message.channel.send(`<a:typing:397490442469376001> **${message.member.displayName}** is petting a cat...`);
      const { body } = await snek.get("http://random.cat/meow");
      message.buildEmbed()
        .setImage(body.file)
        .setTimestamp()
        .send();

      await msg.delete();
    } catch (e) {
      console.log(e);
    }
  }
}

module.exports = Cat;