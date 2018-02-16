const Social = require(`${process.cwd()}/base/Social.js`);
const { get } = require("snekfetch");

class Cat extends Social {
  constructor(client) {
    super(client, {
      name: "cat",
      description: "Post a randomly selected image of a cat.",
      category: "Animals",
      usage: "cat",
      extended: "This command will return a beautiful cat.",
      cost: 5,
      cooldown: 10,
      aliases: ["kitten"],
      loadingString: "<a:typing:397490442469376001> **{{displayName}}** is petting a cat..."
    });
  }

  async run(message, args, level, loadingMessage) {
    const { body } = await get("http://random.cat/meow");
    await loadingMessage.edit({
      embed: {
        "title": "Click here if the image failed to load.",
        "url": body.file,
        "color": message.guild.me.roles.highest.color || 5198940,
        "image": {
          "url": body.file
        }
      }
    });
  }
}

module.exports = Cat;