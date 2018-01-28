const Social = require(`${process.cwd()}/base/Social.js`);
const { MessageAttachment } = require("discord.js");

class Respect extends Social {
  constructor(client) {
    super(client, {
      name: "respect",
      description: "Pay respects to someone.",
      category: "Canvas",
      usage: "respect [@mention|user id]",
      extended: "You can pay respects to any user on Discord.",
      cost: 10,
      cooldown: 30,
      aliases: ["pressf", "f", "rip", "ripme"]
    });
  }

  async run(message, args, level) { // eslint-disable-line no-unused-vars
    let msg;
    try {
      const target = await this.verifyUser(message, args[0] ? args[0] : message.author.id);

      if (message.settings.socialSystem === "true") {
        if (!(await this.cmdPay(message, message.author.id, this.help.cost))) return;
      }
      
      msg = await message.channel.send("Paying respects...");
      const m = await message.channel.send("Press 🇫 to pay respects.", new MessageAttachment(await this.client.idiotAPI.respect(target.displayAvatarURL({format:"png", size:128})), "respect.png"));
      await msg.delete();
      m.react("🇫");
    } catch (error) {
      msg.edit("Something went wrong, please try again later");
      this.client.logger.error(error);
    }
  }

}

module.exports = Respect;//