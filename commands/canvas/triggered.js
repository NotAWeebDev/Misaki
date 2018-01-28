const Social = require(`${process.cwd()}/base/Social.js`);
const { MessageAttachment } = require("discord.js");

class Triggered extends Social {
  constructor(client) {
    super(client, {
      name: "triggered",
      description: "Trigger someone...",
      usage: "triggered [@mention|userid]",
      category: "Canvas",
      extended: "Ever get so pissed off you explode? You got triggered.",
      cost: 10,
      cooldown: 20,
      aliases: ["trigger"]
    });
  }

  async run(message, args, level) { // eslint-disable-line no-unused-vars 
    let msg;
    try {
      const target = await this.verifyUser(message, args[0] ? args[0] : message.author.id);
      
      if (message.settings.socialSystem === "true") {
        if (!(await this.cmdPay(message, message.author.id, this.help.cost))) return;
      }

      msg = await message.channel.send(`<a:typing:397490442469376001> **${message.member.displayName}** is getting triggered...`);
      await message.channel.send(new MessageAttachment(await this.client.idiotAPI.triggered(target.displayAvatarURL({ format:"png", size:512 })), "triggered.gif"));
      await msg.delete();

    } catch (error) {
      msg.edit("Something went wrong, please try again later");
      this.client.logger.error(error);
    }

  }
}
module.exports = Triggered;