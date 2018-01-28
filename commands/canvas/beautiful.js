const Social = require(`${process.cwd()}/base/Social.js`);
const { MessageAttachment } = require("discord.js");

class Beautiful extends Social {
  constructor(client) {
    super(client, {
      name: "beautiful",
      description: "Admire the beauty of another user.",
      category: "Canvas",
      usage: "beautiful [@mention|user id]",
      extended: "Mention another user to admire a painting of them.",
      cost: 10,
      cooldown: 10,
      aliases: ["painting"]
    });
  }

  async run(message, args, level) {// eslint-disable-line no-unused-vars
    let msg;
    try {
      const beautiful = await this.verifyUser(message, args[0] ? args[0] : message.author.id);
      
      if (message.settings.socialSystem === "true") {
        if (!(await this.cmdPay(message, message.author.id, this.help.cost))) return;
      }
      msg = await message.channel.send(`<a:typing:397490442469376001> **${message.member.displayName}** is admiring the painting...`);
      await message.channel.send(new MessageAttachment(await this.client.idiotAPI.beautiful(beautiful.displayAvatarURL({format:"png", size:256})), "beautiful.png"));
      await msg.delete();
    } catch (error) {
      msg.edit("Something went wrong, please try again later");
      this.client.logger.error(error);
    }
  }
}

module.exports = Beautiful;//