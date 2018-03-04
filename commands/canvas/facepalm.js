const Social = require(`${process.cwd()}/base/Social.js`);
const { MessageAttachment } = require("discord.js");

class Facepalm extends Social {
  constructor(client) {
    super(client, {
      name: "facepalm",
      description: "Facepalm at someone's stupidity",
      category: "Canvas",
      usage: "facepalm",
      extended: "Facepalm after witnessing something very stupid.",
      cost: 10,
      cooldown: 10,
      loadingString: "<a:typing:397490442469376001> **{{displayName}}** is just lost for words..."
    });
  }

  async run(message, args, level, loadingMessage) {
    await message.channel.send(new MessageAttachment(await this.client.idiotAPI.facepalm(message.author.displayAvatarURL({format:"png", size:256})), "facepalm.png"));
    await loadingMessage.delete();
  }
}

module.exports = Facepalm;
