const Social = require(`${process.cwd()}/base/Social.js`);
const { MessageAttachment } = require("discord.js");

class Valut extends Social {
  constructor(client) {
    super(client, {
      name: "thumbs",
      description: "Give a thumbs up as another user.",
      category: "Canvas",
      usage: "thumbs [@mention|user id]",
      extended: "Mention another user to thumbs up of them.",
      cost: 10,
      cooldown: 10,
      aliases: ["vault"]
    });
  }

  async run(message, args, level) { // eslint-disable-line no-unused-vars
    let msg;
    try {
      const vaultDweller = await this.verifyUser(message, args[0] ? args[0] : message.author.id);
      if (message.settings.socialSystem === "true") {
        if (!(await this.cmdPay(message, message.author.id, this.help.cost))) return;
      }
      msg = await message.channel.send(`<a:typing:397490442469376001> **${message.member.displayName}** is wandering the wastelands...`);
      await message.channel.send(new MessageAttachment(await this.client.idiotAPI.vaultBoy(vaultDweller.displayAvatarURL({ format:"png", size:128 })), "vaultboy.png"));
      await msg.delete();
    } catch (error) {
      msg.edit("Something went wrong, please try again later");
      this.client.logger.error(error);
    }
  }
}

module.exports = Valut;