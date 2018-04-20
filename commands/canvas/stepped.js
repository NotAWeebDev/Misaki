const Social = require("../../structures/Social.js");
const { MessageAttachment } = require("discord.js");

class Stepped extends Social {
  constructor(...args) {
    super(...args, {
      name: "stepped",
      description: "Post a stepped picture of a user.",
      category: "Canvas",
      usage: "stepped [@mention|user id]",
      extended: "Mention another user to step on them.",
      cost: 10,
      cooldown: 10,
      loadingString: "<a:typing:397490442469376001> **{{displayName}}** is out for a walk when suddenly...",
      botPerms: ["ATTACH_FILES"]
    });
  }

  cmdVerify(message, args, loadingMessage) {
    return this.verifyUser(message, message.mentions.users.size === 1 ? message.mentions.users.first().id : message.author.id, { msg: loadingMessage });
  }

  async run(message, args, level, loadingMessage) {
    const stepped = await this.cmdVerify(message, args, loadingMessage);
    await message.channel.send(new MessageAttachment(await this.client.idiotAPI.stepped(stepped.displayAvatarURL({ format: "png", size: 128})), "stepped.png"));
    await loadingMessage.delete();
  }
}

module.exports = Stepped;
