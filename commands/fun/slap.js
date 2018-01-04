const Social = require(`${process.cwd()}/base/Social.js`);
const { Canvas } = require("canvas-constructor");
const snek = require("snekfetch");
const fsn = require("fs-nextra");

class Slap extends Social {
  constructor(client) {
    super(client, {
      name: "slap",
      description: "Slap another user as Batman.",
      category: "Fun",
      usage: "slap <@mention>",
      extended: "Mention another user to slap them.",
      cost: 1,
      cooldown: 10,
      botPerms: ["ATTACH_FILES"],
      permLevel: "Patron"
    });
  }

  async run(message, args, level) { // eslint-disable-line no-unused-vars 
    try {
      const slapped = await this.verifyUser(message, args[0] ? args[0] : message.author.id);
      const slapper = message.author;

      if (!(await this.cmdPay(message, message.author.id, this.help.cost, this.conf.botPerms))) return;

      const msg = await message.channel.send(`Finding ${slapped.username}...`);

      const { getSlapped } = this;
      const result = await getSlapped(slapper.displayAvatarURL({ format:"png", size:128 }), slapped.displayAvatarURL({ format:"png", size:128 }));
      await message.channel.send({ files: [{ attachment: result, name: "slapped.png" }] });
      await msg.delete();
    } catch (error) {
      this.client.logger.error(error);
    }
  }
  
  async getSlapped(slapper, slapped) {
    const [ plate, Slapper, Slapped, ] = await Promise.all([ fsn.readFile("./assets/images/plate_fanslap.jpg"), snek.get(slapper), snek.get(slapped), ]);
    return new Canvas(640, 480)
      .addImage(plate, 0, 0, 640, 480)
      .addImage(Slapper.body, 229, 62, 64, 64, { type: "round", radius: 32 })
      .restore()
      .addImage(Slapped.body, 405, 245, 64, 64, { type: "round", radius: 32 })
      .restore()
      .toBuffer();
  }

}

module.exports = Slap;