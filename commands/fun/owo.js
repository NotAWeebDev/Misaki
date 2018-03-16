const Social = require("../../base/Social.js");
const { get } = require("snekfetch");

class Owo extends Social {
  constructor(...args) {
    super(...args, {
      name: "owo",
      description: "OwO, what's this?",
      usage: "owo",
      category: "Fun",
      cost: 5,
      aliases: ["uwu", "UwU", "OwO"],
      loadingString: "<a:typing:397490442469376001> OwO whats this? **{{displayName}}**..."
    });
  }

  async run(message, args, level, loadingMessage) {
    const { body } = await get("https://rra.ram.moe/i/r?type=owo");
    await loadingMessage.edit({
      embed: {
        "title": "Click here if the image failed to load.",
        "url": `https://cdn.ram.moe/${body.path.replace("/i/", "")}`,
        "color": message.guild.me.roles.highest.color || 5198940,
        "image": {
          "url": `https://cdn.ram.moe/${body.path.replace("/i/", "")}`
        }
      }
    });

  }
}

module.exports = Owo;
