const Social = require("../../structures/Social.js");

class Cuddle extends Social {
  constructor(...args) {
    super(...args, {
      name: "cuddle",
      description: "Just want to cuddle",
      usage: "cuddle <@mention>",
      category: "Reactions",
      cost: 5,
      botPerms: ["EMBED_LINKS"]
    });
  }

  cmdVerify(message) {
    const target = message.mentions.members;
    if (!target) return message.response(undefined, "You need to mention someone to cuddle them.");
    if (message.member === target.first()) return message.reponse(undefined, "You cannot cuddle yourself !");
    return Promise.resolve(target);
  }

  async run(message) {
    const target = await this.cmdVerify(message);
    const msg = await message.channel.send(`<a:typing:397490442469376001> **${message.member.displayName}** wants to give **${target.first().displayName}** a loving cuddle...`);
    const cuddle = await this.cmdWeeb("cuddle", "gif", message.channel.nsfw);
    await msg.edit({
      embed: {
        "title": "Click here if the image failed to load.",
        "url": cuddle,
        "description": `**${target.first().displayName}**, you just got cuddled by **${message.member.displayName}**`,
        "color": 6192321,
        "image": {
          "url": cuddle
        },
        "footer": {
          "icon_url": message.author.displayAvatarURL({ format: "png", size: 32 }),
          "text": `Requested by ${message.author.tag} | Powered by weeb.sh`
        }
      }
    });

  }
}

module.exports = Cuddle;
