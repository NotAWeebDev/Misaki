const Social = require(`${process.cwd()}/base/Social.js`);
const { MessageAttachment } = require("discord.js");

class FanSlap extends Social {
  constructor(client) {
    super(client, {
      name: "fanslap",
      description: "Slap another user for their idiocy with a paper fan.",
      category: "Canvas",
      usage: "fanslap <@mention | userid>",
      extended: "Mention another user to slap them with a paper fan.",
      cost: 10,
      cooldown: 10
    });
  }

  async run(message, args, level) { // eslint-disable-line no-unused-vars 
    let msg;
    try {
      const slapped = await this.verifyUser(message, args[0] ? args[0] : message.author.id);
      const slapper = message.author;

      if (message.settings.socialSystem === "true") {
        if (!(await this.cmdPay(message, message.author.id, this.help.cost))) return;
      }

      msg = await message.channel.send(`<a:typing:397490442469376001> **${message.member.displayName}** thinks someone needs a smacking...`);
      await message.channel.send(new MessageAttachment(await this.client.idiotAPI.fanSlap(slapper.displayAvatarURL({format:"png", size:64}), slapped.displayAvatarURL({format:"png", size:64})), "fanslap.png"));
      await msg.delete();
    } catch (error) {
      msg.edit("Something went wrong, please try again later");
      this.client.logger.error(error);
    }
  }
}

module.exports = FanSlap;//