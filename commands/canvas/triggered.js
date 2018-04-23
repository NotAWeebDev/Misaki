const Social = require("../../structures/Social.js");
const { MessageAttachment } = require("discord.js");

class Triggered extends Social {
  constructor(...args) {
    super(...args, {
      name: "triggered",
      description: "Trigger someone...",
      usage: "triggered [@mention|userid]",
      category: "Canvas",
      extended: "Ever get so pissed off you explode? You got triggered.",
      cost: 10,
      cooldown: 20,
      aliases: ["trigger"],
      loadingString: "<a:typing:397490442469376001> **{{displayName}}** is getting triggered...",
      botPerms: ["ATTACH_FILES"]
    });
  }

  cmdVerify(message, args, loadingMessage) {
    return this.verifyUser(message, message.mentions.users.size === 1 ? message.mentions.users.first().id : message.author.id, { msg: loadingMessage });
  }

  async run(message, args, level, loadingMessage) { 
    const target = await this.cmdVerify(message, args, loadingMessage);
    await message.channel.send(new MessageAttachment(await this.client.idiotAPI.triggered(target.displayAvatarURL({ format:"png", size:512 })), "triggered.gif"));
    await loadingMessage.delete();
  }
}
module.exports = Triggered;