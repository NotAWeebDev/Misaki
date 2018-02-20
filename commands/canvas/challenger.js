const Social = require(`${process.cwd()}/base/Social.js`);
const { MessageAttachment } = require("discord.js");

class Challenger extends Social {
  constructor(client) {
    super(client, {
      name: "challenger",
      description: "A new challenger has appeared.",
      category: "Canvas",
      usage: "challenger [@mention|user id]",
      cost: 10,
      cooldown: 10,
      aliases:["smash"]
    });
  }

  async run(message, args, level) { // eslint-disable-line no-unused-vars 
    let msg;
    try {
      const challenger = await this.verifyUser(message, args[0] ? args[0] : message.author.id);
      if (message.settings.socialSystem === "true") {
        if (!(await this.cmdPay(message, message.author.id, this.help.cost))) return;
      }
      msg = await message.channel.send(`<a:typing:397490442469376001> **${message.member.displayName}** a new challenger has appeared...`);
      await message.channel.send(new MessageAttachment(await this.client.idiotAPI.challenger(challenger.displayAvatarURL({ format:"png", size:512 })), "new-challenger.png"));
      await msg.delete();
    } catch (error) {
      msg.edit("Something went wrong, please try again later");
      this.client.logger.error(error);
    }
  }
}

module.exports = Challenger;//