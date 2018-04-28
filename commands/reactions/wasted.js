const Social = require("../../structures/Social.js");

class Wasted extends Social {
  constructor(...args) {
    super(...args, {
      name: "wasted",
      description: "They ded.",
      usage: "wasted <@mention>",
      category: "Reactions",
      cost: 5,
      loadingString: "<a:typing:397490442469376001> **{{displayName}}** got wasted...",
      botPerms: ["EMBED_LINKS"]
    });
  }

  async run(message, args, level, loadingMessage) {
    const target = message.mentions.members;
    const wasted = await this.cmdWeeb("wasted", "gif", message.channel.nsfw);
    await loadingMessage.edit({
      embed: {
        "title": "Click here if the image failed to load.",
        "url": wasted,
        "description": `**${message.member.displayName}** just ${message.mentions.members.size === 0 ? "got wasted..." : `wasted **${target.first().displayName}**...`}`,
        "color": 6192321,
        "image": {
          "url": wasted
        },
        "footer": {
          "icon_url": message.author.displayAvatarURL({ format: "png", size: 32 }),
          "text": `Requested by ${message.author.tag} | Powered by weeb.sh`
        }
      }
    });

  }
}

module.exports = Wasted;
