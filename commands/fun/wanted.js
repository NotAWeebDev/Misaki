const Social = require(`${process.cwd()}/base/Social.js`);
const { Canvas } = require("canvas-constructor");
const snek = require("snekfetch");
const fsn = require("fs-nextra");

const getWanted = async (person) => {
  const plate = await fsn.readFile("./assets/images/plate_wanted.png");
  const { body } = await snek.get(person);
  return new Canvas(360, 640)
    .setColor("#debb80")
    .addRect(0, 0, 360, 640)
    .addImage(body, 30, 200, 300, 300)
    .addImage(plate, 0, 0, 360, 640)
    .toBuffer();
};

class Wanted extends Social {
  constructor(client) {
    super(client, {
      name: "wanted",
      description: "Post a wanted picture of a user.",
      category: "Fun",
      usage: "wanted [@mention|user id]",
      extended: "Mention another user to post a wanted poster of them.",
      cost: 5,
      cooldown: 20,
      botPerms: ["ATTACH_FILES"],
    });
  }
  async run(message, args, level) {
    try {
      const wanted = await this.verifyUser(message,args[0] ? args[0] : message.author.id);
      
      const cost = this.cmdDis(this.help.cost, level);
      const payMe = await this.cmdPay(message, message.author.id, cost, this.conf.botPerms);
      if (!payMe) return;

      const msg = await message.channel.send("Fetching the Sheriff...");
      const result = await getWanted(wanted.displayAvatarURL({ format:"png", size:256 }));
      await message.channel.send({ files: [{ attachment: result, name: "wanted.jpg" }] });
      await msg.delete();

    } catch (error) {
      this.client.logger.error(error);
    }
  }
}

module.exports = Wanted;