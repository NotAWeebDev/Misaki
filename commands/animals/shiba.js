const Social = require(`${process.cwd()}/base/Social.js`);
const { get } = require("snekfetch");

class Shibe extends Social {
  constructor(...args) {
    super(...args, {
      name: "shiba",
      description: "Post a randomly selected image of a Shiba Inu.",
      category: "Animals",
      usage: "shiba",
      extended: "This command will return a beautiful Shiba Inu.",
      cost: 5,
      cooldown: 10,
      aliases: ["doge", "shib", "shibe"],
      loadingString: "<a:typing:397490442469376001> **{{displayName}}** is petting a shiba inu..."
    });
  }

  async run(message, args, level, loadingMessage) {
    const { body } = await get("http://shibe.online/api/shibes");
    await loadingMessage.edit({
      embed: {
        "title": "Click here if the image failed to load.",
        "url": body[0],
        "color": message.guild.me.roles.highest.color || 5198940,
        "image": {
          "url": body[0]
        }
      }
    });
  }
}

module.exports = Shibe;