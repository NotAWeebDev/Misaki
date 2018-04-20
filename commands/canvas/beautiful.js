const Social = require("../../structures/Social.js");
const { MessageAttachment } = require("discord.js");

class Beautiful extends Social {
  constructor(...args) {
    super(...args, {
      name: "beautiful",
      description: "Admire the beauty of another user.",
      category: "Canvas",
      usage: "beautiful [@mention|user id]",
      extended: "Mention another user to admire a painting of them.",
      cost: 10,
      cooldown: 10,
      aliases: ["painting"],
      loadingString: "<a:typing:397490442469376001> **{{displayName}}** is admiring the painting...",
      botPerms: ["ATTACH_FILES"]
    });
  }

  cmdVerify(message, args, loadingMessage) {
    return this.verifyUser(message, message.mentions.users.size === 1 ? message.mentions.users.first().id : message.author.id, { msg: loadingMessage });
  }

  async run(message, args, level, loadingMessage) {// eslint-disable-line no-unused-vars
    const beautiful = await this.cmdVerify(message, args, loadingMessage);
    await message.channel.send(new MessageAttachment(await this.client.idiotAPI.beautiful(beautiful.displayAvatarURL({format:"png", size:256})), "beautiful.png"));
    await loadingMessage.delete();
  }
}

module.exports = Beautiful;