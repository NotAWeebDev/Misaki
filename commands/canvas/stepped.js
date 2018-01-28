const Social = require(`${process.cwd()}/base/Social.js`);
const { MessageAttachment } = require("discord.js");

class Stepped extends Social {
  constructor(client) {
    super(client, {
      name: "stepped",
      description: "Post a stepped picture of a user.",
      category: "Canvas",
      usage: "stepped [@mention|user id]",
      extended: "Mention another user to step on them.",
      cost: 10,
      cooldown: 10
    });
  }
  async run(message, args, level) { // eslint-disable-line no-unused-vars
    let msg;
    try {
      const stepped = await this.verifyUser(message, args[0] ? args[0] : message.author.id);
      
      if (message.settings.socialSystem === "true") {
        if (!(await this.cmdPay(message, message.author.id, this.help.cost))) return;
      }

      msg = await message.channel.send(`<a:typing:397490442469376001> **${message.member.displayName}** is out for a walk when suddenly...`);
      await message.channel.send(new MessageAttachment(await this.client.idiotAPI.stepped(stepped.displayAvatarURL({ format: "png", size: 128})), "stepped.png"));
      await msg.delete();

    } catch (error) {
      msg.edit("Something went wrong, please try again later");
      this.client.logger.error(error);
    }
  }
}

module.exports = Stepped;//