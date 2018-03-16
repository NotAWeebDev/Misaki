const Social = require(`${process.cwd()}/base/Social.js`);
const { get } = require("snekfetch");

class Bunny extends Social {
  constructor(...args) {
    super(...args, {
      name: "bunny",
      description: "Post a randomly selected image of a bunny.",
      category: "Animals",
      usage: "bunny",
      extended: "This command will return a beautiful bunny.",
      cost: 5,
      cooldown: 10,
      aliases: ["bunbun"],
      loadingString: "<a:typing:397490442469376001> **{{displayName}}** is petting a bunny..."
    });
  }

  async run(message, args, level, loadingMessage) {
    const { body } = await get("https://api.bunnies.io/v2/loop/random/?media=gif,png");
    await loadingMessage.edit({
      embed: {
        "title": "Click here if the image failed to load.",
        "url": body.media.gif,
        "color": message.guild.me.roles.highest.color || 5198940,
        "image": {
          "url": body.media.gif
        }
      }
    });
  }
}

module.exports = Bunny;