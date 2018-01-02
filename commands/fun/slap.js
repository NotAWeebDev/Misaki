const Social = require(`${process.cwd()}/base/Social.js`);
const { Canvas } = require("canvas-constructor");
const snek = require("snekfetch");
const fsn = require("fs-nextra");

const getSlapped = async (slapper, slapped) => {
  const [
    plate,
    Slapper,
    Slapped,
  ] = await Promise.all([
    fsn.readFile("./assets/images/image_slap.png"),
    snek.get(slapper),
    snek.get(slapped),
  ]);
  return new Canvas(950, 475)
    .addImage(plate, 0, 0, 950, 475)
    .addImage(Slapper.body, 410, 107, 131, 131, { type: "round", radius: 66 })
    .restore()
    .addImage(Slapped.body, 159, 180, 169, 169, { type: "round", radius: 85 })
    .restore()
    .toBuffer();
};

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
  async run(message, args, level) {
    try {
      const slapped = await this.verifyUser(message, args[0] ? args[0] : message.author.id);
      const slapper = message.author;
      const cost = this.cmdDis(this.help.cost, level);
      const payMe = await this.cmdPay(message, message.author.id, cost, this.conf.botPerms);
      if (!payMe) return;  
      const msg = await message.channel.send(`Finding ${slapped.username}...`);

      const result = await getSlapped(slapper.displayAvatarURL({ format:"png", size:128 }), slapped.displayAvatarURL({ format:"png", size:128 }));
      await message.channel.send({ files: [{ attachment: result, name: "slapped.png" }] });
      await msg.delete();
    } catch (error) {
      this.client.logger.error(error);
    }
  }
}

module.exports = Slap;