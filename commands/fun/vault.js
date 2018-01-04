const Social = require(`${process.cwd()}/base/Social.js`);
const { Canvas } = require("canvas-constructor");
const snek = require("snekfetch");
const fsn = require("fs-nextra");

class Valut extends Social {
  constructor(client) {
    super(client, {
      name: "thumbs",
      description: "Give a thumbs up as another user.",
      category: "Fun",
      usage: "thumbs [@mention|user id]",
      extended: "Mention another user to thumbs up of them.",
      cost: 5,
      cooldown: 10,
      aliases: ["vault"],
      botPerms: ["ATTACH_FILES"],
    });
  }

  async run(message, args, level) { // eslint-disable-line no-unused-vars
    try {
      const user = await this.verifyUser(message, args[0] ? args[0] : message.author.id);
      if (!(await this.cmdPay(message, message.author.id, this.conf.botPerms))) return;
      const msg = await message.channel.send("Who's giving a thumbs up?...");
      const { getBeautiful } = this;
      const result = await getBeautiful(user.displayAvatarURL({ format:"png", size:128 }));

      await message.channel.send({ files: [{ attachment: result, name: "thumbs.jpg" }] });
      await msg.delete();
    } catch (error) {
      throw error;
    }
  }

  async getBeautiful(person) {
    const plate = await fsn.readFile("./assets/images/plate_vaultboy.png");
    const { body } = await snek.get(person);
    return new Canvas(365, 365)
      .setColor("#000000")
      .addRect(0, 0, 365, 365)
      .addImage(body, 153, 62, 100, 100)
      .addImage(plate, 0, 0, 365, 365)
      .toBuffer();
  }
}

module.exports = Valut;