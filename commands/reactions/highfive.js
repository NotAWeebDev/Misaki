const Social = require("../../structures/Social.js");

class HighFive extends Social {
  constructor(...args) {
    super(...args, {
      name: "highfive",
      description: "Highfive someone 🖐.",
      usage: "highfive <@mention>",
      category: "Reactions",
      cost: 5,
      loadingString: "<a:typing:397490442469376001> **{{displayName}}** yells out \"Up high!\"...",
      aliases: ["🖐", "hi5"],
      botPerms: ["EMBED_LINKS"]
    });
  }

  cmdVerify(message, args, loadingMessage) {
    const target = message.mentions.members;
    if (target.size === 0) return Promise.reject(new this.client.methods.errors.UsageError("You need to mention someone to hold hands with them.", loadingMessage));
    if (message.member === target.first()) return Promise.reject(new this.client.methods.errors.UsageError("You cannot hold your own hands, well you could but it would be weird!", loadingMessage));
    return Promise.resolve(target);
  }

  async run(message, args, level, loadingMessage) {
    const target = await this.cmdVerify(message, args, loadingMessage);    
    const highfive = await this.cmdWeeb("highfive", "gif", message.channel.nsfw);
    await loadingMessage.edit({
      embed: {
        "title": "Click here if the image failed to load.",
        "url": highfive,
        "description": `**${message.member.displayName}** just gave **${target.first().displayName}** a high five!`,
        "color": 6192321,
        "image": {
          "url": highfive
        },
        "footer": {
          "icon_url": message.author.displayAvatarURL({ format: "png", size: 32 }),
          "text": `Requested by ${message.author.tag} | Powered by weeb.sh`
        }
      }
    });

  }
}

module.exports = HighFive;
