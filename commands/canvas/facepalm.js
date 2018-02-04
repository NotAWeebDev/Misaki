const Social = require(`${process.cwd()}/base/Social.js`);
const { MessageAttachment } = require("discord.js");

class Facepalm extends Social {
  constructor(client) {
    super(client, {
      name: "facepalm",
      description: "Slap another user as Batman.",
      category: "Canvas",
      usage: "facepalm",
      extended: "Mention another user to slap them as batman.",
      cost: 10,
      cooldown: 10
    });
  }

  async run(message, args, level) { // eslint-disable-line no-unused-vars
    const msg = await message.channel.send(`<a:typing:397490442469376001> **${message.member.displayName}** is just lost for words...`);
    if (message.settings.socialSystem === "true") {
      await this.cmdPay(message, message.author.id, this.help.cost, { msg });
    }
    
    await message.channel.send(new MessageAttachment(await this.client.idiotAPI.facepalm(message.author.displayAvatarURL({format:"png", size:256})), "facepalm.png"));
    await msg.delete();
  }
}

module.exports = Facepalm;