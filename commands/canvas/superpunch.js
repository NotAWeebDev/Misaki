const Social = require(`${process.cwd()}/base/Social.js`);
const { MessageAttachment } = require("discord.js");

class Superpunch extends Social {
  constructor(client) {
    super(client, {
      name: "superpunch",
      description: "Punch someone as Superman.",
      category: "Canvas",
      usage: "superpunch <@mention | userid>",
      extended: "Mention another user to punch them as Superman.",
      cost: 10,
      cooldown: 10
    });
  }

  async run(message, args, level) { // eslint-disable-line no-unused-vars 
    const msg = await message.channel.send(`<a:typing:397490442469376001> **${message.member.displayName}** is taking a swing...`);
    const punched = await this.verifyUser(message, args[0] ? args[0] : message.author.id);
    const puncher = message.author;

    if (message.settings.socialSystem === "true") {
      await this.cmdPay(message, message.author.id, this.help.cost, { msg });
    }

    await message.channel.send(new MessageAttachment(await this.client.idiotAPI.superPunch(puncher.displayAvatarURL({format:"png", size:128}), punched.displayAvatarURL({format:"png", size:256})), "superpunch.png"));
    await msg.delete();
  }
}

module.exports = Superpunch;