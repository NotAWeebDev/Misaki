const Social = require(`${process.cwd()}/base/Social.js`);
const { Canvas } = require("canvas-constructor");
const { resolve, join} = require("path");
Canvas.registerFont(resolve(join(__dirname, "../../assets/fonts/NotoEmoji-Regular.ttf")), "Roboto");
Canvas.registerFont(resolve(join(__dirname, "../../assets/fonts/Roboto.ttf")), "Roboto");

const pls = async (person) => {
  const size = new Canvas(130, 84)
    .setTextFont("700 32px Roboto")
    .measureText(person.displayName);
  const newSize = size.width < 130 ? 130 : size.width + 20;
  return new Canvas(newSize, 84)
    .setTextFont("700 32px Roboto")
    .setColor("#B93F2C")
    .setTextBaseline("top")
    .setTextAlign("center")
    .addText("pls", newSize/2, 45)
    .setColor("#F01111")
    .setTextBaseline("top")
    .setTextAlign("center")
    .addText(person.displayName, newSize/2, 5)
    .toBuffer();
};

class Please extends Social {
  constructor(client) {
    super(client, {
      name: "pls",
      description: "Ask nicely!",
      usage: "pls [mention]",
      category: "Fun",
      extended: "Didn't your mother always tell you to say please? Now you can with a bot!",
      cost: 2,
      botPerms: ["ATTACH_FILES"]
    });
  }

  async run(message, args, level) { // eslint-disable-line no-unused-vars 
    try {
      const cost = this.cmdDis(this.help.cost, level);
      const payMe = await this.cmdPay(message, message.author.id, cost, this.conf.botPerms);
      if (!payMe) return;  
      const person = message.mentions.members.first() || message.member;
      const result = await pls(person);
      await message.channel.send({files: [{attachment: result, name: "pls.png"}]});
    } catch (error) {
      this.client.logger.error(error);
    }
  }
}
module.exports = Please;
