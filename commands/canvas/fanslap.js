const Social = require("../../structures/Social.js");
const { MessageAttachment } = require("discord.js");

class FanSlap extends Social {
  constructor(...args) {
    super(...args, {
      name: "fanslap",
      description: "Slap another user for their idiocy with a paper fan.",
      category: "Canvas",
      usage: "fanslap <@mention | userid>",
      extended: "Mention another user to slap them with a paper fan.",
      cost: 10,
      cooldown: 10,
      loadingString: "<a:typing:397490442469376001> **{{displayName}}** thinks someone needs a smacking...",
      botPerms: ["ATTACH_FILES"]
    });
  }

  cmdVerify(message, args, loadingMessage) {
    return this.verifyUser(message, message.mentions.users.size === 1 ? message.mentions.users.first().id : message.author.id, { msg: loadingMessage });
  }

  async run(message, args, level, loadingMessage) {
    const slapped = await this.cmdVerify(message, args, loadingMessage);
    const slapper = message.author;

    await message.channel.send(new MessageAttachment(await this.client.idiotAPI.fanSlap(slapper.displayAvatarURL({format:"png", size:64}), slapped.displayAvatarURL({format:"png", size:64})), "fanslap.png"));
    await loadingMessage.delete();
  }
}

module.exports = FanSlap;//