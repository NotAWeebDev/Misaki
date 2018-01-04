const Social = require(`${process.cwd()}/base/Social.js`);
const { Canvas } = require("canvas-constructor");
const snek = require("snekfetch");
const fsn = require("fs-nextra");

class Stepped extends Social {
  constructor(client) {
    super(client, {
      name: "stepped",
      description: "Post a stepped picture of a user.",
      category: "Fun",
      usage: "stepped [@mention|user id]",
      extended: "Mention another user to step on them.",
      cost: 5,
      cooldown: 20,
      botPerms: ["ATTACH_FILES"],
    });
  }
  async run(message, args, level) { // eslint-disable-line no-unused-vars 
    try {
      const stepped = (message.mentions.users.first() || message.author).displayAvatarURL({ format:"png", size:128 });
      
      if (!(await this.cmdPay(message, message.author.id, this.conf.botPerms))) return;

      const msg = await message.channel.send("Going for a walk...");
      const { getStepped } = this;
      const result = await getStepped(stepped);
      await message.channel.send({ files: [{ attachment: result, name: "stepped.jpg" }] });
      await msg.delete();

    } catch (error) {
      this.client.logger.error(error);
    }
  }
  
  async getStepped(person) {
    const plate = await fsn.readFile("./assets/images/plate_stepped.png");
    const { body } = await snek.get(person);
    return new Canvas(400, 562)
      .setColor("#cccccc")
      .addRect(0, 0, 400, 566)
      .rotate(50 * -Math.PI / 180)
      .addImage(body, -280, 350, 128, 128)
      .rotate(-50 * Math.PI / -180)
      .addImage(plate, 0, 0, 400, 566)
      .toBuffer();
  }  
}

module.exports = Stepped;