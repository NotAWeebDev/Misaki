const Social = require("../../structures/Social.js");
const { MessageAttachment } = require("discord.js");

class Blame extends Social {
  constructor(...args) {
    super(...args, {
      name: "blame",
      description: "Assign the blame to someone else.",
      usage: "blame [mention]",
      category: "Canvas",
      extended: "Blame someone else via this command.",
      cost: 5,
      cooldown: 5,
      loadingString: "<a:typing:397490442469376001> **{{displayName}}** is getting the blame...",
      botPerms: ["ATTACH_FILES"]
    });
  }

  cmdVerify(message, args, loadingMessage) {
    return this.verifyMember(message, message.mentions.members.size === 1 ? message.mentions.members.first().id : message.member.id, { msg: loadingMessage });
  }

  async run(message, args, level, loadingMessage) {
    const person = await this.cmdVerify(message, args, loadingMessage);
    await message.channel.send(new MessageAttachment(await this.client.idiotAPI.blame(person.displayName),"blame.png"));
    await loadingMessage.delete();
  }

}
module.exports = Blame;
