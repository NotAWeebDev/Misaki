const Social = require(`${process.cwd()}/base/Social.js`);
const { MessageAttachment } = require("discord.js");

class Rejected extends Social {
  constructor(client) {
    super(client, {
      name: "rejected",
      description: "Reject someone.",
      category: "Overlays",
      usage: "rejected [@mention|user id]",
      cost: 10,
      cooldown: 10,
      aliases: ["reject"]
    });
  }

  async run(message, args, level) { // eslint-disable-line no-unused-vars 
    let msg;
    try {
      const rejected = await this.verifyUser(message, args[0] ? args[0] : message.author.id);
      if (message.settings.socialSystem === "true") {
        if (!(await this.cmdPay(message, message.author.id, this.help.cost))) return;
      }
      msg = await message.channel.send(`<a:typing:397490442469376001> **${message.member.displayName}** just got rejected, ouch...`);
      await message.channel.send(new MessageAttachment(await this.client.idiotAPI.rejected(rejected.displayAvatarURL({ format:"png", size:512 })), "rejected.png"));
      await msg.delete();
    } catch (error) {
      msg.edit("Something went wrong, please try again later");
      this.client.logger.error(error);
    }
  }
}

module.exports = Rejected;//