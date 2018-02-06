const Social = require(`${process.cwd()}/base/Social.js`);
const { MessageAttachment } = require("discord.js");

class FanSlap extends Social {
  constructor(client) {
    super(client, {
      name: "fanslap",
      description: "Slap another user for their idiocy with a paper fan.",
      category: "Canvas",
      usage: "fanslap <@mention | userid>",
      extended: "Mention another user to slap them with a paper fan.",
      cost: 10,
      cooldown: 10
    });
  }

  async run(message, args, level) { // eslint-disable-line no-unused-vars 
    const msg = await message.channel.send(`<a:typing:397490442469376001> **${message.member.displayName}** thinks someone needs a smacking...`);
    const slapped = await this.verifyUser(message, message.mentions.users.size === 1 ? message.mentions.users.first().id : message.author.id, { msg });
    const slapper = message.author;

    if (message.settings.socialSystem === "true") {
      await this.cmdPay(message, message.author.id, this.help.cost, { msg });
    }

    await message.channel.send(new MessageAttachment(await this.client.idiotAPI.fanSlap(slapper.displayAvatarURL({format:"png", size:64}), slapped.displayAvatarURL({format:"png", size:64})), "fanslap.png"));
    await msg.delete();
  }
}

module.exports = FanSlap;//