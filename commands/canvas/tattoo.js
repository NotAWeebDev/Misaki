const Social = require(`${process.cwd()}/base/Social.js`);
const { MessageAttachment } = require("discord.js");

class Tattoo extends Social {
  constructor(client) {
    super(client, {
      name: "tattoo",
      description: "Get inked.",
      category: "Canvas",
      usage: "tattoo [@mention|user id]",
      extended: "Mention another user to get them tattooed on your arm.",
      cost: 10,
      cooldown: 10,
      aliases: ["ink"]
    });
  }

  async run(message, args, level) {// eslint-disable-line no-unused-vars
    const msg = await message.channel.send(`<a:typing:397490442469376001> **${message.member.displayName}** is getting some ink done...`);
    const customer = await this.verifyUser(message, args[0] || message.author.id);
    if (message.settings.socialSystem === "true") {
      await this.cmdPay(message, message.author.id, this.help.cost, { msg });
    }
    await message.channel.send(new MessageAttachment(await this.client.idiotAPI.tattoo(customer.displayAvatarURL({ format:"png", size:512 })), "tattoo.png"));
    await msg.delete();
  }
}

module.exports = Tattoo;
