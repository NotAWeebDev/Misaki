const Social = require("../../structures/Social.js");
const { MessageAttachment } = require("discord.js");

class Wanted extends Social {
  constructor(...args) {
    super(...args, {
      name: "wanted",
      description: "Post a wanted picture of a user.",
      category: "Canvas",
      usage: "wanted [@mention|user id]",
      extended: "Mention another user to post a wanted poster of them.",
      cost: 10,
      cooldown: 10,
      loadingString: "<a:typing:397490442469376001> **{{displayName}}** is putting up wanted posters...",
      botPerms: ["ATTACH_FILES"]
    });
  }

  cmdVerify(message, args, loadingMessage) {
    return this.verifyUser(message, message.mentions.users.size === 1 ? message.mentions.users.first().id : message.author.id, { msg: loadingMessage });
  }

  async run(message, args, level, loadingMessage) {
    const wanted = await this.cmdVerify(message, args, loadingMessage);
    await message.channel.send(new MessageAttachment(await this.client.idiotAPI.wanted(wanted.displayAvatarURL({ format:"png", size:512 })), "wanted.png"));
    await loadingMessage.delete();
  }
}

module.exports = Wanted;