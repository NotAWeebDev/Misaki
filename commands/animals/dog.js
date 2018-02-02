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
      cost: 5,
      cooldown: 10,
      aliases: ["doggo", "pupper"]
    });
  }

  async run(message, args, level) { // eslint-disable-line no-unused-vars
    const msg = await message.channel.send(`<a:typing:397490442469376001> **${message.member.displayName}** is petting a dog...`);

    if (message.settings.socialSystem === "true") {
      await this.cmdPay(message, message.author.id, this.help.cost, { msg });
    }

    const { body } = await snek.get(args[0] ? `https://dog.ceo/api/breed/${args[0]}/images/random` : "https://dog.ceo/api/breeds/image/random");
    await msg.edit({embed:{ "title": "Click here if the image failed to load.", "url": body.message, "color":message.guild.me.roles.highest.color || 5198940, "image": {"url": body.message}}});

  }
}

module.exports = Dog;