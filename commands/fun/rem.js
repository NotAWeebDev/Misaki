const Social = require(`${process.cwd()}/base/Social.js`);
const { get } = require("snekfetch");

class Rem extends Social {
  constructor(client) {
    super(client, {
      name: "rem",
      description: "Someone needs rem",
      usage: "rem",
      category: "Fun",
      cost: 5,
      loadingString: "<a:typing:397490442469376001> **{{displayName}}** wants rem..."
    });
  }

  async run(message, args, level, loadingMessage) { // eslint-disable-line no-unused-vars
    const { body } = await get("https://rra.ram.moe/i/r?type=rem");
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

module.exports = Rem;
