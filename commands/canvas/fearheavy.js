const Social = require("../../structures/Social.js");
const { MessageAttachment } = require("discord.js");

class HeavyFear extends Social {
  constructor(...args) {
    super(...args, {
      name: "fear",
      description: "Fear nothing... but that thing.",
      category: "Canvas",
      usage: "fear @mention",
      cost: 10,
      cooldown: 10,
      loadingString: "<a:typing:397490442469376001> **{{displayName}}** fears no man...",
      botPerms: ["ATTACH_FILES"]
    });
  }

  cmdVerify(message, args, loadingMessage) {
    return this.verifyUser(message, message.mentions.users.size === 1 ? message.mentions.users.first().id : message.author.id, { msg: loadingMessage });
  }

  async run(message, args, level, loadingMessage) { // eslint-disable-line no-unused-vars 
    const feared = await this.cmdVerify(message, args, loadingMessage);
    await message.channel.send(new MessageAttachment(await this.client.idiotAPI.heavyFear(feared.displayAvatarURL({ format: "png", size: 256 })), "feared.png"));
    await loadingMessage.delete();
  }
}

module.exports = HeavyFear;