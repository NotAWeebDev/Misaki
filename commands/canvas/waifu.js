const Social = require("../../structures/Social.js");
const { MessageAttachment } = require("discord.js");

class Waifu extends Social {
  constructor(...args) {
    super(...args, {
      name: "waifu",
      description: "Rate someone.",
      category: "Canvas",
      usage: "waifu @mention",
      extended: "Mention another user to post rate them.",
      cost: 10,
      cooldown: 10,
      loadingString: "<a:typing:397490442469376001> **{{displayName}}** is judging...",
      botPerms: ["ATTACH_FILES"]
    });
  }

  cmdVerify(message, args, loadingMessage) {
    return this.verifyUser(message, message.mentions.users.size === 1 ? message.mentions.users.first().id : message.author.id, { msg: loadingMessage });
  }

  async run(message, args, level, loadingMessage) { // eslint-disable-line no-unused-vars 
    const waifu = await this.cmdVerify(message, args, loadingMessage);
    await message.channel.send(new MessageAttachment(await this.client.idiotAPI.waifuInsult(waifu.displayAvatarURL({ format: "png", size: 256 })), "waifu.png"));    await loadingMessage.delete();
  }
}

module.exports = Waifu;