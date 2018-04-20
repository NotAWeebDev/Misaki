const Social = require("../../structures/Social.js");
const { MessageAttachment } = require("discord.js");

class Garbage extends Social {
  constructor(...args) {
    super(...args, {
      name: "garbage",
      description: "Thrown out with the trash.",
      category: "Canvas",
      usage: "garbage [@mention]",
      cost: 10,
      cooldown: 10,
      loadingString: "<a:typing:397490442469376001> **{{displayName}}** is thrown out with the garbage...",
      botPerms: ["ATTACH_FILES"]
    });
  }

  cmdVerify(message, args, loadingMessage) {
    return this.verifyUser(message, message.mentions.users.size === 1 ? message.mentions.users.first().id : message.author.id, { msg: loadingMessage });
  }

  async run(message, args, level, loadingMessage) { // eslint-disable-line no-unused-vars 
    const garbage = await this.cmdVerify(message, args, loadingMessage);
    await message.channel.send(new MessageAttachment(await this.client.idiotAPI.garbage(garbage.displayAvatarURL({ format: "png", size: 256 })), "garbage.png"));
    await loadingMessage.delete();
  }
}

module.exports = Garbage;