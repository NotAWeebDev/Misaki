const Social = require(`${process.cwd()}/base/Social.js`);
const { MessageAttachment } = require("discord.js");

class Rainbow extends Social {
  constructor(client) {
    super(client, {
      name: "rainbow",
      description: "Show off your rainbow.",
      category: "Overlays",
      usage: "rainbow [@mention|user id]",
      cost: 10,
      cooldown: 10
    });
  }

  async run(message, args, level) { // eslint-disable-line no-unused-vars 
    let msg;
    try {
      const rainbow = await this.verifyUser(message, args[0] ? args[0] : message.author.id);
      if (message.settings.socialSystem === "true") {
        if (!(await this.cmdPay(message, message.author.id, this.help.cost))) return;
      }
      msg = await message.channel.send(`<a:typing:397490442469376001> **${message.member.displayName}** look what a pretty rainbow...`);
      await message.channel.send(new MessageAttachment(await this.client.idiotAPI.rainbow(rainbow.displayAvatarURL({ format:"png", size:2048 })), "pretty-rainbow.png"));
      await msg.delete();
    } catch (error) {
      msg.edit("Something went wrong, please try again later");
      this.client.logger.error(error);
    }
  }
}

module.exports = Rainbow;//