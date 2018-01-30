const Social = require(`${process.cwd()}/base/Social.js`);
const { MessageAttachment } = require("discord.js");

class Batslap extends Social {
  constructor(client) {
    super(client, {
      name: "batslap",
      description: "Slap another user as Batman.",
      category: "Canvas",
      usage: "batslap <@mention | userid>",
      extended: "Mention another user to slap them as batman.",
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

      msg = await message.channel.send(`<a:typing:397490442469376001> **${message.member.displayName}** is stalking his prey...`);

      await message.channel.send(new MessageAttachment(await this.client.idiotAPI.batSlap(slapper.displayAvatarURL({format:"png", size:128}), slapped.displayAvatarURL({format:"png", size:256})), "batslap.png"));
      await msg.delete();
    } catch (error) {
      msg.edit("Something went wrong, please try again later");
      this.client.logger.error(error);
    }
  }
}

module.exports = Batslap;