const Social = require(`${process.cwd()}/base/Social.js`);
const { MessageAttachment } = require("discord.js");

class Blame extends Social {
  constructor(client) {
    super(client, {
      name: "blame",
      description: "Assign the blame to someone else.",
      usage: "blame [mention]",
      category: "Canvas",
      extended: "Blame someone else via this command.",
      cost: 5,
      cooldown: 5
    });
  }

  async run(message, args, level) { // eslint-disable-line no-unused-vars
    let msg;
    try {
      if (message.settings.socialSystem === "true") {
        if (!(await this.cmdPay(message, message.author.id, this.help.cost))) return;
      }
      const person = await this.verifyMember(message, message.mentions.users.size === 1 ? message.mentions.users.first().id : message.author.id);
      msg = await message.channel.send(`<a:typing:397490442469376001> **${person.displayName}** is getting the blame...`);
      await message.channel.send(new MessageAttachment(await this.client.idiotAPI.blame((message.mentions.members.first() || message.member).displayName),"blame.png"));
      await msg.delete();
    } catch (error) {
      msg.edit("Something went wrong, please try again later");
      this.client.logger.error(error);
    }
  }

}
module.exports = Blame;
