const Social = require(`${process.cwd()}/base/Social.js`);
const { MessageAttachment } = require("discord.js");

class Challenger extends Social {
  constructor(...args) {
    super(...args, {
      name: "challenger",
      description: "A new challenger has appeared.",
      category: "Canvas",
      usage: "challenger [@mention]",
      cost: 10,
      cooldown: 10,
      aliases:["smash"],
      loadingString: "<a:typing:397490442469376001> **{{displayName}}** a new challenger has appeared..."
    });
  }

  cmdVerify(message, args, loadingMessage) {
    return this.verifyUser(message, message.mentions.users.size === 1 ? message.mentions.users.first().id : message.author.id, { msg: loadingMessage });
  }

  async run(message, args, level, loadingMessage) { // eslint-disable-line no-unused-vars 
    const challenger = await this.cmdVerify(message, args, loadingMessage);
    await message.channel.send(new MessageAttachment(await this.client.idiotAPI.challenger(challenger.displayAvatarURL({ format:"png", size:512 })), "new-challenger.png"));
    await loadingMessage.delete();
  }
}

module.exports = Challenger;