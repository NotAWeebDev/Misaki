const Social = require("../../base/Social.js");
const { get } = require("snekfetch");
const { MessageAttachment } = require("discord.js");

class Tiger extends Social {
  constructor(...args) {
    super(...args, {
      name: "tiger",
      description: "Post a randomly selected image of a tiger.",
      category: "Animals",
      usage: "tiger",
      extended: "This command will return a beautiful tiger.",
      cost: 5,
      cooldown: 10,
      aliases: ["tigger"],
      loadingString: "<a:typing:397490442469376001> **{{displayName}}** is petting a tiger..."
    });
  }

  async run(message, args, level, loadingMessage) {
    const { body } = await get("https://dashboard.typicalbot.com/api/v1/tiger").set("Authentication", process.env.TYPICAL);
    const embed = new this.client.methods.Embed()
      .setColor(message.guild.me.roles.highest.color || 5198940)
      .attachFiles([new MessageAttachment(Buffer.from(body.data), "image.png")])
      .setImage("attachment://image.png");
    message.channel.send({ embed });
    await loadingMessage.delete();
  }
}

module.exports = Tiger;