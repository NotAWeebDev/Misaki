const Social = require("../../structures/Social.js");
const { MessageAttachment } = require("discord.js");

class Tattoo extends Social {
  constructor(...args) {
    super(...args, {
      name: "tattoo",
      description: "Get inked.",
      category: "Canvas",
      usage: "tattoo [@mention|user id]",
      extended: "Mention another user to get them tattooed on your arm.",
      cost: 10,
      cooldown: 10,
      aliases: ["ink"],
      loadingString: "<a:typing:397490442469376001> **{{displayName}}** is getting some ink done...",
      botPerms: ["ATTACH_FILES"]
    });
  }

  cmdVerify(message, args, loadingMessage) {
    return this.verifyUser(message, message.mentions.users.size === 1 ? message.mentions.users.first().id : message.author.id, { msg: loadingMessage });
  }

  async run(message, args, level, loadingMessage) {
    const customer = await this.cmdVerify(message, args, loadingMessage);
    await message.channel.send(new MessageAttachment(await this.client.idiotAPI.tattoo(customer.displayAvatarURL({ format:"png", size:512 })), "tattoo.png"));
    await loadingMessage.delete();
  }
}

module.exports = Tattoo;
