const Social = require(`${process.cwd()}/base/Social.js`);

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
    const potato = await this.cmdWeeb("potato");
    await loadingMessage.edit({
      embed: {
        "title": "Click here if the image failed to load.",
        "url": `https://cdn.ram.moe/${potato}`,
        "color": message.guild.me.roles.highest.color || 5198940,
        "image": {
          "url": `https://cdn.ram.moe/${potato}`
        }
      }
    });

  }
}

module.exports = Potato;
