const Social = require(`${process.cwd()}/base/Social.js`);
const { MessageAttachment } = require("discord.js");

class Please extends Social {
  constructor(client) {
    super(client, {
      name: "pls",
      description: "Ask nicely!",
      usage: "pls [mention]",
      category: "Canvas",
      extended: "Didn't your mother always tell you to say please? Now you can with a bot!",
      cost: 5
    });
  }

  async run(message, args, level) { // eslint-disable-line no-unused-vars 
    let msg;
    try {
      if (message.settings.socialSystem === "true") {
        if (!(await this.cmdPay(message, message.author.id, this.help.cost))) return;
      }
      const person = await this.verifyMember(message, message.mentions.users.size === 1 ? message.mentions.users.first().id : message.author.id);
      msg = await message.channel.send(`<a:typing:397490442469376001> **${person.displayName}** pls...`);
      await message.channel.send(new MessageAttachment(await this.client.idiotAPI.pls((message.mentions.members.first() || message.member).displayName),"pls.png"));
      await msg.delete();
    } catch (error) {
      msg.edit("Something went wrong, please try again later");
      this.client.logger.error(error);
    }
  }

}
module.exports = Please;
