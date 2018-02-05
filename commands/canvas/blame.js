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
    const msg = await message.channel.send(`<a:typing:397490442469376001> **${person.displayName}** is getting the blame...`);

    if (message.settings.socialSystem === "true") {
      await this.cmdPay(message, message.author.id, this.help.cost, { msg });
    }
    
    const person = await this.verifyMember(message, args[0] || message.author.id, { msg });
    await message.channel.send(new MessageAttachment(await this.client.idiotAPI.blame((message.mentions.members.first() || message.member).displayName),"blame.png"));
    await msg.delete();
  }

}
module.exports = Blame;
