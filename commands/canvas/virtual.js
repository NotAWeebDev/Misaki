const Social = require("../../structures/Social.js");
const { MessageAttachment } = require("discord.js");

class Virtual extends Social {
  constructor(...args) {
    super(...args, {
      name: "virtual",
      description: "Virtual Reality is so real!",
      category: "Canvas",
      usage: "virtual [@mention]",
      cost: 10,
      cooldown: 10,
      loadingString: "<a:typing:397490442469376001> **{{displayName}}** thinks VR is amazing...",
      botPerms: ["ATTACH_FILES"]
    });
  }

  cmdVerify(message, args, loadingMessage) {
    return this.verifyUser(message, message.mentions.users.size === 1 ? message.mentions.users.first().id : message.author.id, { msg: loadingMessage });
  }

  async run(message, args, level, loadingMessage) { // eslint-disable-line no-unused-vars 
    const vrImg = await this.cmdVerify(message, args, loadingMessage);
    await message.channel.send(new MessageAttachment(await this.client.idiotAPI.virtual(vrImg.displayAvatarURL({ format: "png", size: 512 })), "virtual.png"));
    await loadingMessage.delete();
  }
}

module.exports = Virtual;