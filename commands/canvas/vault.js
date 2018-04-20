const Social = require("../../structures/Social.js");
const { MessageAttachment } = require("discord.js");

class Valut extends Social {
  constructor(...args) {
    super(...args, {
      name: "thumbs",
      description: "Give a thumbs up as another user.",
      category: "Canvas",
      usage: "thumbs [@mention|user id]",
      extended: "Mention another user to thumbs up of them.",
      cost: 10,
      cooldown: 10,
      aliases: ["vault"],
      loadingString: "<a:typing:397490442469376001> **{{displayName}}** is wandering the wastelands...",
      botPerms: ["ATTACH_FILES"]
    });
  }

  cmdVerify(message, args, loadingMessage) {
    return this.verifyUser(message, message.mentions.users.size === 1 ? message.mentions.users.first().id : message.author.id, { msg: loadingMessage });
  }

  async run(message, args, level, loadingMessage) {
    const vaultDweller = await this.cmdVerify(message, args, loadingMessage);
    await message.channel.send(new MessageAttachment(await this.client.idiotAPI.vaultBoy(vaultDweller.displayAvatarURL({ format: "png", size: 128 })), "vaultboy.png"));
    await loadingMessage.delete();
  }
}

module.exports = Valut;
