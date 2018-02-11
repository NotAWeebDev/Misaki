const Social = require(`${process.cwd()}/base/Social.js`);

class Owo extends Social {
  constructor(client) {
    super(client, {
      name: "owo",
      description: "OwO, what's this?",
      usage: "owo",
      category: "Fun",
      cost: 5,
      aliases: ["uwu", "UwU", "OwO"],
      loadingString: "<a:typing:397490442469376001> OwO whats this? **${{displayName}}**..."
    });
  }

  async run(message, args, level, loadingMessage) {
    const owo = await this.cmdWeeb("owo");
    await loadingMessage.edit({
      embed: {
        "title": "Click here if the image failed to load.",
        "url": `https://cdn.ram.moe/${owo}`,
        "color": message.guild.me.roles.highest.color || 5198940,
        "image": {
          "url": `https://cdn.ram.moe/${owo}`
        }
      }
    });

  }
}

module.exports = Owo;
