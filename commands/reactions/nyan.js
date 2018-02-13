const Social = require(`${process.cwd()}/base/Social.js`);
const { get } = require("snekfetch");
class Nyan extends Social {
  constructor(client) {
    super(client, {
      name: "nyan",
      description: "Someone needs a nyan in their life.",
      usage: "nyan",
      category: "Reactions",
      cost: 5,
      loadingString: "<a:typing:397490442469376001> **{{displayName}}** wants a nyan..."
    });
  }

  async run(message, args, level, loadingMessage) { // eslint-disable-line no-unused-vars
    const { body } = await get("https://rra.ram.moe/i/r?type=nyan");
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

module.exports = Nyan;
