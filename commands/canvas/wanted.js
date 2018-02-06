const Social = require(`${process.cwd()}/base/Social.js`);
const { MessageAttachment } = require("discord.js");

class Wanted extends Social {
  constructor(client) {
    super(client, {
      name: "wanted",
      description: "Post a wanted picture of a user.",
      category: "Canvas",
      usage: "wanted [@mention|user id]",
      extended: "Mention another user to post a wanted poster of them.",
      cost: 10,
      cooldown: 10
    });
  }

  async run(message, args, level) { // eslint-disable-line no-unused-vars 
    const msg = await message.channel.send(`<a:typing:397490442469376001> **${message.member.displayName}** is putting up wanted posters...`);
    const vaultDweller = await this.verifyUser(message, message.mentions.users.size === 1 ? message.mentions.users.first().id : message.author.id);
    if (message.settings.socialSystem === "true") {
      await this.cmdPay(message, message.author.id, this.help.cost, { msg });
    }
    await message.channel.send(new MessageAttachment(await this.client.idiotAPI.wanted(vaultDweller.displayAvatarURL({ format:"png", size:512 })), "wanted.png"));
    await msg.delete();
  }
}

module.exports = Wanted;
