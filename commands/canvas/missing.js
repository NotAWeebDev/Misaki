const Social = require("../../structures/Social.js");
const { MessageAttachment } = require("discord.js");

class Missing extends Social {
  constructor(...args) {
    super(...args, {
      name: "missing",
      description: "Post a missing persons poster of a user.",
      category: "Canvas",
      usage: "missing [@mention|user id]",
      extended: "Mention another user to post a missing persons poster of them.",
      cost: 10,
      cooldown: 10,
      loadingString: "<a:typing:397490442469376001> **{{displayName}}** is putting up missing person posters...",
      botPerms: ["ATTACH_FILES"]
    });
  }

  cmdVerify(message, args, loadingMessage) {
    return this.verifyUser(message, message.mentions.users.size === 1 ? message.mentions.users.first().id : message.author.id, { msg: loadingMessage });
  }

  async run(message, args, level, loadingMessage) {
    const missingPersons = await this.cmdVerify(message, args, loadingMessage);
    await message.channel.send(new MessageAttachment(await this.client.idiotAPI.missing(missingPersons.displayAvatarURL({ format: "png", size: 512 }), (message.mentions.members.first() || message.member).displayName), "missing.png"));
    await loadingMessage.delete();
  }
}

module.exports = Missing;
