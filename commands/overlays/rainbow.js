const Social = require("../../structures/Social.js");
const { MessageAttachment } = require("discord.js");

class Rainbow extends Social {
  constructor(...args) {
    super(...args, {
      name: "rainbow",
      description: "Show off your rainbow.",
      category: "Canvas",
      usage: "rainbow [@mention]",
      cost: 10,
      cooldown: 10,
      loadingString: "<a:typing:397490442469376001> **{{displayName}}** look! A pretty rainbow..."
    });
  }

  cmdVerify(message, args, loadingMessage) {
    return this.verifyUser(message, message.mentions.users.size === 1 ? message.mentions.users.first().id : message.author.id, { msg: loadingMessage });
  }

  async run(message, args, level, loadingMessage) {
    const person = await this.cmdVerify(message, args, loadingMessage);
    await message.channel.send(new MessageAttachment(await this.client.idiotAPI.rainbow(person.displayAvatarURL({ format: "png", size: 2048 }), (message.mentions.members.first() || message.member).displayName), "pretty-rainbow.png"));
    await loadingMessage.delete();
  }
}

module.exports = Rainbow;
