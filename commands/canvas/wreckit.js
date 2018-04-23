const Social = require("../../structures/Social.js");
const { MessageAttachment } = require("discord.js");

class Wreck extends Social {
  constructor(...args) {
    super(...args, {
      name: "wreck",
      description: "Look what Wreck have.",
      category: "Canvas",
      usage: "wreck [@mention]",
      cost: 10,
      cooldown: 10,
      loadingString: "<a:typing:397490442469376001> **{{displayName}}** is getting wrecked...",
      botPerms: ["ATTACH_FILES"]
    });
  }

  cmdVerify(message, args, loadingMessage) {
    return this.verifyUser(message, message.mentions.users.size === 1 ? message.mentions.users.first().id : message.author.id, { msg: loadingMessage });
  }

  async run(message, args, level, loadingMessage) { // eslint-disable-line no-unused-vars 
    const wrecked = await this.cmdVerify(message, args, loadingMessage);
    await message.channel.send(new MessageAttachment(await this.client.idiotAPI.wreckIt(wrecked.displayAvatarURL({ format: "png", size: 256 })), "wreck.png"));
    await loadingMessage.delete();
  }
}

module.exports = Wreck;