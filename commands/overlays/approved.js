const Social = require(`${process.cwd()}/base/Social.js`);
const { MessageAttachment } = require("discord.js");

class Approved extends Social {
  constructor(client) {
    super(client, {
      name: "approved",
      description: "Show off your stamp of approval.",
      category: "Overlays",
      usage: "approved [@mention|user id]",
      cost: 10,
      cooldown: 10,
      aliases: ["approve"]
    });
  }

  async run(message, args, level) { // eslint-disable-line no-unused-vars 
    let msg;
    try {
      const approved = await this.verifyUser(message, args[0] ? args[0] : message.author.id);
      if (message.settings.socialSystem === "true") {
        if (!(await this.cmdPay(message, message.author.id, this.help.cost))) return;
      }
      msg = await message.channel.send(`<a:typing:397490442469376001> **${message.member.displayName}** just got approved...`);
      await message.channel.send(new MessageAttachment(await this.client.idiotAPI.approved(approved.displayAvatarURL({ format:"png", size:512 })), "approved.png"));
      await msg.delete();
    } catch (error) {
      msg.edit("Something went wrong, please try again later");
      this.client.logger.error(error);
    }
  }
}

module.exports = Approved;//