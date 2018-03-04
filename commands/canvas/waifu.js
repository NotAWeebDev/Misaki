const Social = require(`${process.cwd()}/base/Social.js`);
const { MessageAttachment } = require("discord.js");

class Waifu extends Social {
  constructor(client) {
    super(client, {
      name: "waifu",
      description: "Rate someone.",
      category: "Canvas",
      usage: "waifu @mention",
      extended: "Mention another user to post rate them.",
      cost: 10,
      cooldown: 10
    });
  }

  async run(message, args, level) { // eslint-disable-line no-unused-vars 
    let msg;
    try {
      const waifu = await this.verifyUser(message, args[0] ? args[0] : message.author.id);
      if (message.settings.socialSystem === "true") {
        if (!(await this.cmdPay(message, message.author.id, this.help.cost))) return;
      }
      msg = await message.channel.send(`<a:typing:397490442469376001> **${message.member.displayName}** is judging a waifu...`);
      await message.channel.send(new MessageAttachment(await this.client.idiotAPI.waifuInsult(waifu.displayAvatarURL({ format: "png", size: 256 })), "waifu.png"));
      await msg.delete();
    } catch (error) {
      msg.edit("Something went wrong, please try again later");
      this.client.logger.error(error);
    }
  }
}

module.exports = Waifu;//