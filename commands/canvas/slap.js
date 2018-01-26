const Social = require(`${process.cwd()}/base/Social.js`);
const snek = require("snekfetch");
// const { MessageAttachment } = require("discord.js");
class Slap extends Social {
  constructor(client) {
    super(client, {
      name: "slap",
      description: "Slap another user for their idiocy.",
      category: "Fun",
      usage: "slap <@mention>",
      extended: "Mention another user to slap them.",
      cost: 10,
      cooldown: 10
    });
  }

  async run(message, args, level) { // eslint-disable-line no-unused-vars 
    try {
      const slapped = await this.verifyUser(message, args[0] ? args[0] : message.author.id);
      const slapper = message.author;

      if (message.settings.socialSystem === "true") {
        if (!(await this.cmdPay(message, message.author.id, this.help.cost))) return;
      }

      const msg = await message.channel.send(`<a:typing:397490442469376001> **${message.member.displayName}** thinks someone needs a smacking...`);

      const { body } = await snek.get(`http://api.anidiots.guide/api/slap/?slapper=${slapper.displayAvatarURL({ format:"png", size:128 })}&slapped=${slapped.displayAvatarURL({ format:"png", size:128 })}`).set("token", this.client.config.idiotToken);

      // await message.channel.buildEmbed()
      //   .setColor(0x00adff)
      //   .attachFiles([new MessageAttachment(body, "image.png")])
      //   .setImage("attachment://image.png")
      //   .send()
      //   .catch(err => message.error(err));
      await message.channel.send({ files: [{ attachment: body, name: "slapped.png" }] });
      await msg.delete();
    } catch (error) {
      this.client.logger.error(error);
    }
  }
}

module.exports = Slap;//