const Social = require(`${process.cwd()}/base/Social.js`);

class Gun extends Social {
  constructor(client) {
    super(client, {
      name: "gun",
      description: "AAARGHHH!",
      usage: "gun",
      category: "Reactions",
      cost: 5,
      loadingString: "<a:typing:397490442469376001> **{{displayName}}** needs a bigger gun."
    });
  }

  async run(message, args, level, loadingMessage) { // eslint-disable-line no-unused-vars
    const bang = await this.cmdWeeb("bang", "gif", message.channel.nsfw);
    await loadingMessage.edit({
      embed: {
        "title": "Click here if the image failed to load.",
        "url": bang,
        "color": message.guild.me.roles.highest.color || 5198940,
        "image": {
          "url": bang
        }
      }
    });
  }
}

module.exports = Gun;
