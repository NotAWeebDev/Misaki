const Social = require(`${process.cwd()}/base/Social.js`);
const { Canvas } = require("canvas-constructor");
const snek = require("snekfetch");
const fsn = require("fs-nextra");

class Tattoo extends Social {
  constructor(client) {
    super(client, {
      name: "tattoo",
      description: "Get inked.",
      category: "Fun",
      usage: "tattoo [@mention|user id]",
      extended: "Mention another user to get them tattooed on your arm.",
      cost: 5,
      cooldown: 10,
      aliases: ["ink"]
    });
  }

  async run(message, args, level) {// eslint-disable-line no-unused-vars
    try {
      const tattoo = await this.verifyUser(message, args[0] ? args[0] : message.author.id);
      
      if (!(await this.cmdPay(message, message.author.id, this.help.cost))) return;
      const msg = await message.channel.send(`<a:typing:397490442469376001> **${message.member.displayName}** is getting inked...`);
  
      const { getInked } = this;
      const result = await getInked(tattoo.displayAvatarURL({ format:"png", size:512 }));
      await message.channel.send({ files: [{ attachment: result, name: "tattoo.jpg" }] });
     
      await msg.delete();
    } catch (error) {
      this.client.logger.error(error);
    }
  }

  async getInked(person) {
    const plate = await fsn.readFile("./assets/images/plate_tattoo.png");
    const { body } = await snek.get(person);
    return new Canvas(750, 1089)
      .setColor("#000000")
      .addRect(0, 0, 750, 1089)
      .addImage(plate, 0, 0, 750, 1089)
      .addImage(body, 145, 575, 400, 400, { type: "round", radius: 200 })
      .toBuffer();
  }
}

module.exports = Tattoo;