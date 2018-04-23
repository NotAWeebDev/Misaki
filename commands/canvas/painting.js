const Social = require("../../structures/Social.js");
const { MessageAttachment } = require("discord.js");

class Painting extends Social {
  constructor(...args) {
    super(...args, {
      name: "painting",
      description: "Display a valuable, but deadly painting.",
      category: "Canvas",
      usage: "painting [@mention|user id]",
      extended: "Mention another user to post a deadly painting of them.",
      cost: 10,
      cooldown: 10,
      loadingString: "<a:typing:397490442469376001> **{{displayName}}** is selling a painting...",
      botPerms: ["ATTACH_FILES"]
    });
  }

  cmdVerify(message, args, loadingMessage) {
    return this.verifyUser(message, message.mentions.users.size === 1 ? message.mentions.users.first().id : message.author.id, { msg: loadingMessage });
  }

  async run(message, args, level, loadingMessage) { // eslint-disable-line no-unused-vars 
    const painting = await this.cmdVerify(message, args, loadingMessage);
    await message.channel.send(new MessageAttachment(await this.client.idiotAPI.painting(painting.displayAvatarURL({ format: "png", size: 256 })), "painting.png"));
    await loadingMessage.delete();
  }
}

module.exports = Painting;