const Social = require(`${process.cwd()}/base/Social.js`);
const UsageError = require("../../util/CustomError.js");

class Hug extends Social {
  constructor(client) {
    super(client, {
      name: "hug",
      description: "Give someone a hug.",
      usage: "hug <@mention>",
      category: "Reactions",
      cost: 5,
      loadingString: "<a:typing:397490442469376001> **{{displayName}}** wants to give a big hug..."
    });
  }

  cmdVerify(message, args, loadingMessage) {
    const target = message.mentions.members;
    if (target.size === 0) return Promise.reject(new UsageError("You need to mention someone to send them a hug.", loadingMessage));
    if (message.member == target.first()) return Promise.reject(new UsageError("You cannot hug yourself !", loadingMessage));
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
        "color": message.guild.me.roles.highest.color || 5198940,
        "image": {
          "url": hug
        }
      }
    });

  }
}

module.exports = Hug;
