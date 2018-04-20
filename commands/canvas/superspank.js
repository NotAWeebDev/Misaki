const Social = require("../../structures/Social.js");
const { MessageAttachment } = require("discord.js");

class Superspank extends Social {
  constructor(...args) {
    super(...args, {
      name: "superspank",
      description: "Spank someone as Superman.",
      category: "Canvas",
      usage: "superspank <@mention | userid>",
      extended: "Mention another user to spank them as Superman.",
      cost: 10,
      cooldown: 10,
      loadingString: "<a:typing:397490442469376001> **{{displayName}}** is putting someone over their knee...",
      botPerms: ["ATTACH_FILES"]
    });
  }


  cmdVerify(message, args, loadingMessage) {
    return this.verifyUser(message, message.mentions.users.size === 1 ? message.mentions.users.first().id : message.author.id, { msg: loadingMessage });
  }

  async run(message, args, level, loadingMessage) {
    const spanked = await this.cmdVerify(message, args, loadingMessage);
    const spanker = message.author;

    await message.channel.send(new MessageAttachment(await this.client.idiotAPI.superSpank(spanker.displayAvatarURL({ format: "png", size: 128 }), spanked.displayAvatarURL({ format: "png", size: 128 })), "superspank.png"));
    await loadingMessage.delete();
  }
}

module.exports = Superspank;