const Social = require(`${process.cwd()}/base/Social.js`);
const { MessageAttachment } = require("discord.js");

class Tinder extends Social {
  constructor(client) {
    super(client, {
      name: "tinder",
      description: "Get matched.",
      category: "Canvas",
      usage: "tinder <@mention | userid>",
      extended: "Swipe right on another member.",
      cost: 10,
      cooldown: 10
    });
  }

  async run(message, args, level) { // eslint-disable-line no-unused-vars 
    let msg;
    try {
      const match = await this.verifyUser(message, args[0] ? args[0] : message.author.id);
      const avatar = message.author;

      if (message.settings.socialSystem === "true") {
        if (!(await this.cmdPay(message, message.author.id, this.help.cost))) return;
      }

      msg = await message.channel.send(`<a:typing:397490442469376001> **${message.member.displayName}** is getting matched up...`);

      await message.channel.send(new MessageAttachment(await this.client.idiotAPI.tinderMatch(avatar.displayAvatarURL({ format: "png", size: 256 }), match.displayAvatarURL({ format: "png", size: 256 })), "tinder.png"));
      await msg.delete();
    } catch (error) {
      msg.edit("Something went wrong, please try again later");
      console.log(error);
      this.client.logger.error(error);
    }
  }
}

module.exports = Tinder;