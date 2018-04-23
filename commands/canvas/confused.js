const Social = require("../../structures/Social.js");
const { MessageAttachment } = require("discord.js");

class Confused extends Social {
  constructor(...args) {
    super(...args, {
      name: "confused",
      description: "Show someone how confused you are.",
      category: "Canvas",
      usage: "confused",
      cost: 10,
      cooldown: 10,
      loadingString: "<a:typing:397490442469376001> **{{displayName}}** feels rather confused...",
      botPerms: ["ATTACH_FILES"]
    });
  }

  cmdVerify(message, args, loadingMessage) {
    return this.verifyUser(message, message.mentions.users.size === 1 ? message.mentions.users.first().id : message.author.id, { msg: loadingMessage });
  }

  async run(message, args, level, loadingMessage) {
    await message.channel.send(new MessageAttachment(await this.client.idiotAPI.confused(message.author.displayAvatarURL({ format:"png", size:128 }), message.guild.members.random().user.displayAvatarURL({ format: "png", size: 128 })), "confused.png"));
    await loadingMessage.delete();
  }
}

module.exports = Confused;//