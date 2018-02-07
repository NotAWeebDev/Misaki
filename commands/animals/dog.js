const Social = require(`${process.cwd()}/base/Social.js`);
const { get } = require("snekfetch");
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
      aliases: ["doggo", "pupper"],
      loadingString: "<a:typing:397490442469376001> **{{displayName}}** is petting a dog..."
    });
  }

  async run(message, args, level, loadingMessage) {
    const { body } = await get(args[0] ? `https://dog.ceo/api/breed/${args[0]}/images/random` : "https://dog.ceo/api/breeds/image/random");
    await loadingMessage.edit({embed:{ "title": "Click here if the image failed to load.", "url": body.message, "color":message.guild.me.roles.highest.color || 5198940, "image": {"url": body.message}}});

  }
}

module.exports = Dog;