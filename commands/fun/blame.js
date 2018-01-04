const Social = require(`${process.cwd()}/base/Social.js`);
const { Canvas } = require("canvas-constructor");
const { resolve, join} = require("path");
Canvas.registerFont(resolve(join(__dirname, "../../assets/fonts/NotoEmoji-Regular.ttf")), "Roboto");
Canvas.registerFont(resolve(join(__dirname, "../../assets/fonts/Roboto.ttf")), "Roboto");
const blame = async (person) => {
  const size = new Canvas(130, 84)
    .setTextFont("700 32px Roboto")
    .measureText(person.displayName);
  const newSize = size.width < 130 ? 130 : size.width + 20;
  return new Canvas(newSize, 84)
    .setTextFont("700 32px Roboto")
    .setColor("#B93F2C")
    .setTextBaseline("top")
    .setTextAlign("center")
    .addText("Blame", newSize/2, 5)
    .setColor("#F01111")
    .setTextBaseline("top")
    .setTextAlign("center")
    .addText(person.displayName, newSize/2, 45)
    .toBuffer();
};

class Blame extends Social {
  constructor(client) {
    super(client, {
      name: "blame",
      description: "Assign the blame to someone else.",
      usage: "blame [mention]",
      category: "Fun",
      extended: "Blame someone else via this command.",
      cost: 2,
      cooldown: 5,
      botPerms: ["ATTACH_FILES"]
    });
  }

  async run(message, args, level) { // eslint-disable-line no-unused-vars 
    try {
      if (!(await this.cmdPay(message, message.author.id, this.conf.botPerms))) return;
      const person = message.mentions.members.first() || message.member;
      const msg = await message.channel.send(`<a:typing:397490442469376001> **${person.displayName}** is getting the blame...`);
      const result = await blame(person);
      await message.channel.send({files: [{attachment: result, name: "blame.png"}]});
      await msg.delete();
    } catch (error) {
      this.client.logger.error(error);
    }
  }
}
module.exports = Blame;
