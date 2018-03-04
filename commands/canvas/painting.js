const Social = require(`${process.cwd()}/base/Social.js`);
const { MessageAttachment } = require("discord.js");

class Painting extends Social {
  constructor(client) {
    super(client, {
      name: "painting",
      description: "Display a valuable, but deadly painting.",
      category: "Canvas",
      usage: "painting [@mention|user id]",
      extended: "Mention another user to post a deadly painting of them.",
      cost: 10,
      cooldown: 10
    });
  }

  async run(message, args, level) { // eslint-disable-line no-unused-vars 
    let msg;
    try {
      const painting = await this.verifyUser(message, args[0] ? args[0] : message.author.id);
      if (message.settings.socialSystem === "true") {
        if (!(await this.cmdPay(message, message.author.id, this.help.cost))) return;
      }
      msg = await message.channel.send(`<a:typing:397490442469376001> **${message.member.displayName}** is selling a painting...`);
      await message.channel.send(new MessageAttachment(await this.client.idiotAPI.painting(painting.displayAvatarURL({ format: "png", size: 256 })), "painting.png"));
      await msg.delete();
    } catch (error) {
      msg.edit("Something went wrong, please try again later");
      this.client.logger.error(error);
    }
  }
}

module.exports = Painting;//