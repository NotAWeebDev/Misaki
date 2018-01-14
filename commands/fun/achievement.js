const Social = require(`${process.cwd()}/base/Social.js`);
const { Canvas } = require("canvas-constructor");
const snek = require("snekfetch");
const { resolve, join } = require("path");
const fsn = require("fs-nextra");
Canvas.registerFont(resolve(join(__dirname, "../../assets/fonts/Minecraftia.ttf")), "Minecraftia");
Canvas.registerFont(resolve(join(__dirname, "../../assets/fonts/NotoEmoji-Regular.ttf")), "Minecraftia");

class Achievement extends Social {
  constructor(client) {
    super(client, {
      name: "achievement",
      description: "Creates an Achievement.",
      category: "Fun",
      usage: "achievement",
      extended: "Either mention a user with text to give the achievement their user avatar, or just supply text for your own achievement.",
      cost: 10,
      cooldown: 10,
      aliases: ["get", "achieveget", "achievementget"]
    });
  }

  async run(message, args, level) { // eslint-disable-line no-unused-vars 
    let text = args.join(" ");
    if (text.length < 1) return message.response(undefined, "You must give an achievement description.");
    if (text.length > 22) return message.response(undefined, "I can only handle a maximum of 22 characters");
    
    try {
      if (message.settings.socialSystem === "true") {
        if (!(await this.cmdPay(message, message.author.id, this.help.cost))) return;
      }
      const msg = await message.channel.send(`<a:typing:397490442469376001> **${message.member.displayName}** is getting an achievement...`);
      const person = (message.mentions.users.first() || message.author).displayAvatarURL({ format:"png", size:32 });
      if (message.mentions.users.first()) text = text.replace(/<@!?\d+>/, "").replace(/\n/g, " ").trim();
      const { getAchievement } = this;
      const result = await getAchievement(text, person);
      await message.channel.send({ files: [{ attachment: result, name: "achievementGet.png" }] });
      await msg.delete();
    } catch (error) {
      console.log(error);
      // this.client.logger.error(error);
    }
  }

  async getAchievement(text, person) {
    const plate = await fsn.readFile("./assets/images/plate_achievement.png");
    const { body } = await snek.get(person);
    return new Canvas(320, 64)
      .addImage(plate, 0, 0, 320, 64)
      .addImage(body, 16, 16, 32, 32, { type: "round", radius: 16 })
      .restore()
      .setTextFont("12pt Minecraftia")
      .setColor("#FFFFFF")
      .addText(text, 60, 58)
      .toBuffer();
  }
  
}

module.exports = Achievement;