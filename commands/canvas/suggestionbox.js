const Social = require("../../structures/Social.js");
const { MessageAttachment } = require("discord.js");

class SuggestionBox extends Social {
  constructor(...args) {
    super(...args, {
      name: "suggest",
      description: "Look what SuggestionBox have.",
      category: "Canvas",
      usage: "suggest [@mention]",
      cost: 10,
      cooldown: 10,
      loadingString: "<a:typing:397490442469376001> **{{displayName}}** look what suggest has..."
    });
  }

  cmdVerify(message, [...text], loadingMessage) { // eslint-disable-line no-unused-vars
    return this.verifyUser(message, message.mentions.users.size === 1 ? message.mentions.users.first().id : message.author.id, { msg: loadingMessage });
  }

  async run(message, [...text], level, loadingMessage) { // eslint-disable-line no-unused-vars 
    await message.channel.send(new MessageAttachment(await this.client.idiotAPI.suggestion(message.author.displayAvatarURL({ format: "png", size: 256 }), text), "suggest.png"));
    await loadingMessage.delete();
  }
}

module.exports = SuggestionBox;