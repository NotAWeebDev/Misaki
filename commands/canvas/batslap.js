const Social = require("../../structures/Social.js");
const { MessageAttachment } = require("discord.js");

class Batslap extends Social {
  constructor(...args) {
    super(...args, {
      name: "batslap",
      description: "Slap another user as Batman.",
      category: "Canvas",
      usage: "batslap <@mention | userid>",
      extended: "Mention another user to slap them as batman.",
      cost: 10,
      cooldown: 10,
      loadingString: "<a:typing:397490442469376001> **{{displayName}}** is stalking his prey...",
      botPerms: ["ATTACH_FILES"]
    });
  }

  cmdVerify(message, args, loadingMessage) {
    return this.verifyUser(message, message.mentions.users.size === 1 ? message.mentions.users.first().id : message.author.id, { msg: loadingMessage });
  }

  async run(message, args, level, loadingMessage) { 
    const slapped = await this.cmdVerify(message, args, loadingMessage);
    const slapper = message.author;
    await message.channel.send(new MessageAttachment(await this.client.idiotAPI.batSlap(slapper.displayAvatarURL({format:"png", size:128}), slapped.displayAvatarURL({format:"png", size:256})), "batslap.png"));
    await loadingMessage.delete();
  }
}

module.exports = Batslap;