const Social = require(`${process.cwd()}/base/Social.js`);

class Dance extends Social {
  constructor(...args) {
    super(...args, {
      name: "dance",
      description: "Someone needs to dance",
      usage: "dance [@mention]",
      category: "Reactions",
      cost: 5,
      loadingString: "<a:typing:397490442469376001> **{{displayName}}** breaks out some dance moves..."
    });
  }

  async run(message, args, level, loadingMessage) { // eslint-disable-line no-unused-vars
    const target = message.mentions.members;
    let response = "...";
    if (target.size !== 0) response = ` with **${target.first().displayName}**`;
    const dance = await this.cmdWeeb("dance", "gif", message.channel.nsfw);
    await loadingMessage.edit({
      embed: {
        "title": "Click here if the image failed to load.",
        "url": dance,
        "description": `**${message.member.displayName}** boogies${response}`,
        "color": message.guild.me.roles.highest.color || 5198940,
        "image": {
          "url": dance
        }
      }
    });
  }
}

module.exports = Dance;
