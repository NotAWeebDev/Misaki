const Social = require("../../structures/Social.js");
const { MessageAttachment } = require("discord.js");

class Facepalm extends Social {
  constructor(...args) {
    super(...args, {
      name: "facepalm",
      description: "Slap another user as Batman.",
      category: "Canvas",
      usage: "facepalm",
      extended: "Mention another user to slap them as batman.",
      cost: 10,
      cooldown: 10,
      loadingString: "<a:typing:397490442469376001> **{{displayName}}** is just lost for words...",
      botPerms: ["ATTACH_FILES"]
    });
  }

  async run(message, args, level, loadingMessage) {
    await message.channel.send(new MessageAttachment(await this.client.idiotAPI.facepalm(message.author.displayAvatarURL({format:"png", size:256})), "facepalm.png"));
    await loadingMessage.delete();
  }
}

module.exports = Facepalm;