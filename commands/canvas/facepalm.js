const Social = require(`${process.cwd()}/base/Social.js`);
const snek = require("snekfetch");

class Facepalm extends Social {
  constructor(client) {
    super(client, {
      name: "facepalm",
      description: "Slap another user as Batman.",
      category: "Canvas",
      usage: "facepalm <@mention>",
      extended: "Mention another user to slap them as batman.",
      cost: 10,
      cooldown: 10
    });
  }

  async run(message, args, level) { // eslint-disable-line no-unused-vars 
    try {
      if (message.settings.socialSystem === "true") {
        if (!(await this.cmdPay(message, message.author.id, this.help.cost))) return;
      }

      const msg = await message.channel.send(`<a:typing:397490442469376001> **${message.member.displayName}** is just lost for words...`);
      const { body } = await snek.get(`http://api.anidiots.guide/api/facepalm/?avatar=${message.author.displayAvatarURL({ format:"png", size:128 })}`).set("token", this.client.config.idiotToken);
      await message.channel.send({ files: [{ attachment: body, name: "facepalm.png" }] });
      await msg.delete();
    } catch (error) {
      this.client.logger.error(error);
    }
  }
}

module.exports = Facepalm;