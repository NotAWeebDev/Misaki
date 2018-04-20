const Social = require("../../structures/Social.js");
const { MessageAttachment } = require("discord.js");

class Tinder extends Social {
  constructor(...args) {
    super(...args, {
      name: "tinder",
      description: "Get matched.",
      category: "Canvas",
      usage: "tinder <@mention | userid>",
      extended: "Swipe right on another member.",
      cost: 10,
      cooldown: 10,
      loadingString: "<a:typing:397490442469376001> **{{displayName}}** is swiping right...",
      botPerms: ["ATTACH_FILES"]
    });
  }


  cmdVerify(message, args, loadingMessage) {
    return this.verifyUser(message, message.mentions.users.size === 1 ? message.mentions.users.first().id : message.author.id, { msg: loadingMessage });
  }

  async run(message, args, level, loadingMessage) {
    const match = await this.cmdVerify(message, args, loadingMessage);
    const avatar = message.author;

    await message.channel.send(new MessageAttachment(await this.client.idiotAPI.tinderMatch(avatar.displayAvatarURL({ format: "png", size: 256 }), match.displayAvatarURL({ format: "png", size: 256 })), "tinder.png"));
    await loadingMessage.delete();
  }
}

module.exports = Tinder;