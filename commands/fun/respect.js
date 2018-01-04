const Social = require(`${process.cwd()}/base/Social.js`);
const { Canvas } = require("canvas-constructor");
const snek = require("snekfetch");
const fsn = require("fs-nextra");

class Respect extends Social {
  constructor(client) {
    super(client, {
      name: "respect",
      description: "Pay respects to someone.",
      category: "Fun",
      usage: "respect [@mention|user id]",
      extended: "You can pay respects to any user on Discord.",
      cost: 1,
      cooldown: 30,
      aliases: ["pressf", "f", "rip", "ripme"],
      botPerms: ["ATTACH_FILES"],
      permLevel: "Patron"
    });
  }

  async run(message, args, level) { // eslint-disable-line no-unused-vars 
    try {
      const target = await this.verifyUser(message, args[0] ? args[0] : message.author.id);

      if (!(await this.cmdPay(message, message.author.id, this.conf.botPerms))) return;
      
      const msg = await message.channel.send("Paying respects...");
      
      const { giveRespect } = this;
      const result = await giveRespect(target.displayAvatarURL({ format:"png", size:128 }));
      const m = await message.channel.send("Press 🇫 to pay respects.", { files: [{ attachment: result, name: "paid-respects.png" }] });
      await msg.delete();
      m.react("🇫");
    } catch (error) {
      this.client.logger.error(error);
    }
  }

  async giveRespect(person) {
    const plate = await fsn.readFile("./assets/images/image_respects.png");
    const { body } = await snek.get(person);
    return new Canvas(720, 405)
      .addRect(0, 0, 720, 405)
      .setColor("#000000")
      .addImage(body, 110, 45, 90, 90)
      .restore()
      .addImage(plate, 0, 0, 720, 405)
      .toBuffer();
  }  
}

module.exports = Respect;