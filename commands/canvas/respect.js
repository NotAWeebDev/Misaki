const Social = require("../../structures/Social.js");
const { MessageAttachment } = require("discord.js");

class Respect extends Social {
  constructor(...args) {
    super(...args, {
      name: "respect",
      description: "Pay respects to someone.",
      category: "Canvas",
      usage: "respect [@mention|user id]",
      extended: "You can pay respects to any user on Discord.",
      cost: 10,
      cooldown: 30,
      aliases: ["pressf", "f", "rip", "ripme"],
      loadingString: "Paying respects...",
      botPerms: ["ATTACH_FILES", "ADD_REACTIONS"]
    });
  }

  cmdVerify(message, args, loadingMessage) {
    return this.verifyUser(message, message.mentions.users.size === 1 ? message.mentions.users.first().id : message.author.id, { msg: loadingMessage });
  }

  async run(message, args, level, loadingMessage) { // eslint-disable-line no-unused-vars
    const target = await this.cmdVerify(message, args, loadingMessage);
      
    const m = await message.channel.send("Press 🇫 to pay respects.", new MessageAttachment(await this.client.idiotAPI.respect(target.displayAvatarURL({format:"png", size:128})), "respect.png"));
    await loadingMessage.delete();
    m.react("🇫");
  }

}

module.exports = Respect;//