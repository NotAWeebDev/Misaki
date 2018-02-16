const Social = require(`${process.cwd()}/base/Social.js`);

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
    const rem = await this.cmdWeeb("rem");
    await loadingMessage.edit({
      embed: {
        "title": "Click here if the image failed to load.",
        "url": `https://cdn.ram.moe/${rem}`,
        "color": message.guild.me.roles.highest.color || 5198940,
        "image": {
          "url": `https://cdn.ram.moe/${rem}`
        }
      }
    });

  }
}

module.exports = Rem;
