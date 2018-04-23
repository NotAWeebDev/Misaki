const Social = require("../../structures/Social.js");
const { MessageAttachment } = require("discord.js");

class Superpunch extends Social {
  constructor(...args) {
    super(...args, {
      name: "superpunch",
      description: "Punch someone as Superman.",
      category: "Canvas",
      usage: "superpunch <@mention | userid>",
      extended: "Mention another user to punch them as Superman.",
      cost: 10,
      cooldown: 10,
      loadingString: "<a:typing:397490442469376001> **{{displayName}}** is taking a swing...",
      botPerms: ["ATTACH_FILES"]
    });
  }


  cmdVerify(message, args, loadingMessage) {
    return this.verifyUser(message, message.mentions.users.size === 1 ? message.mentions.users.first().id : message.author.id, { msg: loadingMessage });
  }

  async run(message, args, level, loadingMessage) {
    const punched = await this.cmdVerify(message, args, loadingMessage);
    const puncher = message.author;

    await message.channel.send(new MessageAttachment(await this.client.idiotAPI.superPunch(puncher.displayAvatarURL({format:"png", size:128}), punched.displayAvatarURL({format:"png", size:256})), "superpunch.png"));
    await loadingMessage.delete();
  }
}

module.exports = Superpunch;