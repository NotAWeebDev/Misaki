const Social = require("../../structures/Social.js");
const { MessageAttachment } = require("discord.js");

class Approved extends Social {
  constructor(...args) {
    super(...args, {
      name: "approved",
      description: "Show off your stamp of approval.",
      category: "Canvas",
      usage: "approved [@mention]",
      cost: 10,
      cooldown: 10,
      aliases: ["approve"],
      loadingString: "<a:typing:397490442469376001> **{{displayName}}** just got approved..."
    });
  }

  cmdVerify(message, args, loadingMessage) {
    return this.verifyUser(message, message.mentions.users.size === 1 ? message.mentions.users.first().id : message.author.id, { msg: loadingMessage });
  }

  async run(message, args, level, loadingMessage) {
    const person = await this.cmdVerify(message, args, loadingMessage);
    await message.channel.send(new MessageAttachment(await this.client.idiotAPI.approved(person.displayAvatarURL({ format: "png", size: 512 }), (message.mentions.members.first() || message.member).displayName), "approved.png"));
    await loadingMessage.delete();
  }
}

module.exports = Approved;
