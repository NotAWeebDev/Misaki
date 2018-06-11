const Social = require("../../structures/Social.js");

class Dance extends Social {
  constructor(...args) {
    super(...args, {
      name: "dance",
      description: "Someone needs to dance",
      usage: "dance [@mention]",
      category: "Reactions",
      cost: 5,
      loadingString: "<a:typing:397490442469376001> **{{displayName}}** breaks out some dance moves...",
      botPerms: ["EMBED_LINKS"]
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
        "color": 6192321,
        "image": {
          "url": dance
        },
        "footer": {
          "icon_url": message.author.displayAvatarURL({ format: "png", size: 32 }),
          "text": `Requested by ${message.author.tag} | Powered by weeb.sh`
        }
      }
    });
  }
}

module.exports = Dance;
