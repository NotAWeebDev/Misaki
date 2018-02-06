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
    const msg = await message.channel.send(`<a:typing:397490442469376001> **${message.member.displayName}** is getting triggered...`);
    const target = await this.verifyUser(message, message.mentions.users.size === 1 ? message.mentions.users.first().id : message.author.id);
      
    if (message.settings.socialSystem === "true") {
      await this.cmdPay(message, message.author.id, this.help.cost, { msg });
    }

    await message.channel.send(new MessageAttachment(await this.client.idiotAPI.triggered(target.displayAvatarURL({ format:"png", size:512 })), "triggered.gif"));
    await msg.delete();

  }
}
module.exports = Triggered;