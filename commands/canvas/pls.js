const Social = require("../../structures/Social.js");
const { MessageAttachment } = require("discord.js");

class Please extends Social {
  constructor(...args) {
    super(...args, {
      name: "pls",
      description: "Ask nicely!",
      usage: "pls [mention]",
      category: "Canvas",
      extended: "Didn't your mother always tell you to say please? Now you can with a bot!",
      cost: 5,
      loadingString: "<a:typing:397490442469376001> **{{displayName}}** pls...",
      botPerms: ["ATTACH_FILES"]
    });
  }

  cmdVerify(message, args, loadingMessage) {
    return this.verifyMember(message, message.mentions.users.size === 1 ? message.mentions.users.first().id : message.author.id, { msg: loadingMessage });
  }

  async run(message, args, level, loadingMessage) { // eslint-disable-line no-unused-vars 
    const person = await this.cmdVerify(message, args, loadingMessage);
    await message.channel.send(new MessageAttachment(await this.client.idiotAPI.pls(person.displayName),"pls.png"));
    await loadingMessage.delete();
  }

}
module.exports = Please;
