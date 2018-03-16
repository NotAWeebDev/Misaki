const Social = require(`${process.cwd()}/base/Social.js`);

class Pout extends Social {
  constructor(...args) {
    super(...args, {
      name: "pout",
      description: "Someone needs a pout",
      usage: "pout",
      category: "Reactions",
      cost: 5,
      loadingString: "<a:typing:397490442469376001> **{{displayName}}** is pouting..."
    });
  }

  async run(message, args, level, loadingMessage) { // eslint-disable-line no-unused-vars
    const pout = await this.cmdWeeb("pout", "gif", message.channel.nsfw);
    await loadingMessage.edit({
      embed: {
        "title": "Click here if the image failed to load.",
        "url": pout,
        "color": message.guild.me.roles.highest.color || 5198940,
        "image": {
          "url": pout
        }
      }
    });
  }
}

module.exports = Pout;
