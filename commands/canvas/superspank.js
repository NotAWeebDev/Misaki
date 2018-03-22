const Social = require(`${process.cwd()}/base/Social.js`);
const { MessageAttachment } = require("discord.js");

class Superspank extends Social {
  constructor(client) {
    super(client, {
      name: "superspank",
      description: "Spank someone as Superman.",
      category: "Canvas",
      usage: "superspank <@mention | userid>",
      extended: "Mention another user to spank them as Superman.",
      cost: 10,
      cooldown: 10
    });
  }

  async run(message, args, level) { // eslint-disable-line no-unused-vars 
    let msg;
    try {
      const spanked = await this.verifyUser(message, args[0] ? args[0] : message.author.id);
      const spanker = message.author;

      if (message.settings.socialSystem === "true") {
        if (!(await this.cmdPay(message, message.author.id, this.help.cost))) return;
      }

      msg = await message.channel.send(`<a:typing:397490442469376001> **${message.member.displayName}** is giving someone a good spanking...`);

      await message.channel.send(new MessageAttachment(await this.client.idiotAPI.superSpank(spanker.displayAvatarURL({ format: "png", size: 128 }), spanked.displayAvatarURL({ format: "png", size: 128 })), "superspank.png"));
      await msg.delete();
    } catch (error) {
      msg.edit("Something went wrong, please try again later");
      this.client.logger.error(error);
    }
  }
}

module.exports = Superspank;