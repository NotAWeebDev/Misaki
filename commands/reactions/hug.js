const Social = require("../../structures/Social.js");

class Hug extends Social {
  constructor(...args) {
    super(...args, {
      name: "hug",
      description: "Give someone a hug.",
      usage: "hug <@mention>",
      category: "Reactions",
      cost: 5,
      loadingString: "<a:typing:397490442469376001> **{{displayName}}** wants to give a big hug...",
      botPerms: ["EMBED_LINKS"]
    });
  }

  cmdVerify(message, args, loadingMessage) {
    const target = message.mentions.members;
    if (target.size === 0) return Promise.reject(new this.client.methods.errors.UsageError("You need to mention someone to send them a hug.", loadingMessage));
    if (message.member === target.first()) return Promise.reject(new this.client.methods.errors.UsageError("You cannot hug yourself !", loadingMessage));
    return Promise.resolve(target);
  }

  async run(message, args, level, loadingMessage) { // eslint-disable-line no-unused-vars
    const target = await this.cmdVerify(message, args, loadingMessage);
    const hug = await this.cmdWeeb("hug", "gif", message.channel.nsfw);
    await loadingMessage.edit({
      embed: {
        "title": "Click here if the image failed to load.",
        "url": hug,
        "description": `**${target.first().displayName}**, you just got hugged by **${message.member.displayName}**`,
        "color": 6192321,
        "image": {
          "url": hug
        },
        "footer": {
          "icon_url": message.author.displayAvatarURL({ format: "png", size: 32 }),
          "text": `Requested by ${message.author.tag} | Powered by weeb.sh`
        }
      }
    });

  }
}

module.exports = Hug;
