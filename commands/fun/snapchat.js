const Social = require(`${process.cwd()}/base/Social.js`);

const { Canvas } = require("canvas-constructor");
const [width, height] = [400, 533];
const { resolve, join} = require("path");
const fsn = require("fs-nextra");
Canvas.registerFont(resolve(join(__dirname, "../../assets/fonts/Helvetica75-Bold.ttf")), "Snapchat");
Canvas.registerFont(resolve(join(__dirname, "../../assets/fonts/NotoEmoji-Regular.ttf")), "Snapchat");

const getSnap = async (text) => {
  const snap = await fsn.readFile("./assets/images/image_snapchat.png");
  return new Canvas(width, height)
    .addImage(snap, 0, 0, width, height)
    .restore()
    .setTextAlign("center")
    .setTextFont("18pt Snapchat")
    .setColor("#FFFFFF")
    .addText(text, width / 2, 390)
    .toBuffer();
};

class SnapChat extends Social {
  constructor(client) {
    super(client, {
      name: "snapchat",
      description: "Creates a snapchat based meme.",
      usage: "snapchat <text>",
      category: "Fun",
      extended: "This command uses canvas to generate a Snapchat styled image based on the well known statue meme.",
      cost: 4,
      cooldown: 20,
      aliases: ["sc"],
      botPerms: ["ATTACH_FILES"]
    });
  }

  async run(message, args, level) { // eslint-disable-line no-unused-vars 
    const text = args.join(" ");
    if (text.length < 1) return message.response(undefined, "You must give the snap some text.");
    if (text.length > 28) return message.response(undefined, "I can only handle a maximum of 28 characters");
    try {
      const cost = this.cmdDis(this.help.cost, level);
      const payMe = await this.cmdPay(message, message.author.id, cost, this.conf.botPerms);
      if (!payMe) return;  
      const result = await getSnap(text);
      await message.channel.send({ files: [{ attachment: result, name: `${text.toLowerCase().replace(" ", "-").replace(".", "-")}.png`}]});
    } catch (error) {
      this.client.logger.error(error);
    }
  }
}

module.exports = SnapChat;