const Social = require(`${process.cwd()}/base/Social.js`);
const { get } = require("snekfetch");

class Potato extends Social {
  constructor(client) {
    super(client, {
      name: "potato",
      description: "Someone needs a potato",
      usage: "potato",
      category: "Fun",
      cost: 5,
      aliases: ["spud"],
      loadingString: "<a:typing:397490442469376001> **{{displayName}}** is a potato...`"
    });
  }

  async run(message, args, level, loadingMessage) { // eslint-disable-line no-unused-vars
    const { body } = await get("https://rra.ram.moe/i/r?type=potato");
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

module.exports = Potato;
