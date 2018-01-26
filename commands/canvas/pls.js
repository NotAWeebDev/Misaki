const Social = require(`${process.cwd()}/base/Social.js`);
const { Canvas } = require("canvas-constructor");
const { resolve, join} = require("path");
Canvas.registerFont(resolve(join(__dirname, "../../assets/fonts/NotoEmoji-Regular.ttf")), "Roboto");
Canvas.registerFont(resolve(join(__dirname, "../../assets/fonts/Roboto.ttf")), "Roboto");

class Please extends Social {
  constructor(client) {
    super(client, {
      name: "pls",
      description: "Ask nicely!",
      usage: "pls [mention]",
      category: "Canvas",
      extended: "Didn't your mother always tell you to say please? Now you can with a bot!",
      cost: 5
    });
  }

  async run(message, args, level) { // eslint-disable-line no-unused-vars 
    try {
      if (message.settings.socialSystem === "true") {
        if (!(await this.cmdPay(message, message.author.id, this.help.cost))) return;
      }
      const person = message.mentions.members.first() || message.member;
      const { pls } = this;
      const result = await pls(person);
      await message.channel.send({files: [{attachment: result, name: "pls.png"}]});
    } catch (error) {
      this.client.logger.error(error);
    }
  }

  async pls(person) {
    let newWidth;
    return new Canvas(130, 84)
      .setTextFont("700 32px Roboto")
      .measureText(person.displayName, ({ width }, self) => {
        newWidth = width < 130 ? 130 : width + 20;
        self.changeCanvasWidth(newWidth);
      })
      .setColor("#B93F2C")
      .setTextBaseline("top")
      .setTextAlign("center")
      .addText("pls", newWidth/2, 45)
      .setColor("#F01111")
      .setTextBaseline("top")
      .setTextAlign("center")
      .addText(person.displayName, newWidth/2, 5)
      .toBuffer();
  }  
}
module.exports = Please;
