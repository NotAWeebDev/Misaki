const Social = require("../../structures/Social.js");

class Cry extends Social {
  constructor(...args) {
    super(...args, {
      name: "cry",
      description: "For when you just can't keep it in.",
      usage: "cry <@mention>",
      category: "Reactions",
      cost: 5,
      loadingString: "<a:typing:397490442469376001> **{{displayName}}** wants to cry it all away...",
      botPerms: ["EMBED_LINKS"]
    });
  }

  cmdVerify(message, args, loadingMessage) {
    const target = message.mentions.members;
    if (target.size === 0) return Promise.reject(new this.client.methods.errors.UsageError("You need to mention someone to cry on their shoulder.", loadingMessage));
    if (message.member === target.first()) return Promise.reject(new this.client.methods.errors.UsageError("You cannot cry on yourself!", loadingMessage));
    return Promise.resolve(target);
  }

  async run(message, args, level, loadingMessage) { // eslint-disable-line no-unused-vars
    const target = await this.cmdVerify(message, args, loadingMessage);
    const cry = await this.cmdWeeb("cry", "gif", message.channel.nsfw);
    await loadingMessage.edit({
      embed: {
        "title": "Click here if the image failed to load.",
        "url": cry,
        "description": `**${target.first().displayName}**, **${message.member.displayName}** just cried on your shoulder.`,
        "color": 6192321,
        "image": {
          "url": cry
        },
        "footer": {
          "icon_url": message.author.displayAvatarURL({ format: "png", size: 32 }),
          "text": `Requested by ${message.author.tag} | Powered by weeb.sh`
        }
      }
    });
  }
}

module.exports = Cry;
