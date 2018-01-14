const Social = require(`${process.cwd()}/base/Social.js`);
const Canvas = require("canvas");
const snek = require("snekfetch");
const { readFile } = require("fs-nextra");
const GIFEncoder = require("gifencoder");

class Triggered extends Social {
  constructor(client) {
    super(client, {
      name: "triggered",
      description: "Trigger someone...",
      usage: "triggered [@mention|userid]",
      category: "Fun",
      extended: "Ever get so pissed off you explode? You got triggered.",
      cost: 10,
      cooldown: 20,
      aliases: ["trigger"]
    });
  }

  async run(message, args, level) { // eslint-disable-line no-unused-vars 
    try {
      const target = await this.verifyUser(message, args[0] ? args[0] : message.author.id);

      if (message.settings.socialSystem === "true") {
        if (!(await this.cmdPay(message, message.author.id, this.help.cost))) return;
      }

      const msg = await message.channel.send(`Triggering...${target.tag}`);

      const attachment = await this.getTriggered(target.displayAvatarURL({ format:"png", size:512 }));
      await message.channel.send({ files: [{ attachment, name: "triggered.gif" }] });
      await msg.delete();
    } catch (error) {
      this.client.logger.error(error);
    }
  }
  
  streamToArray(stream) {
    if (!stream.readable) return Promise.resolve([]);
    return new Promise((resolve, reject) => {
      const array = [];
  
      function onData(data) {
        array.push(data);
      }
  
      function onEnd(error) {
        if (error) reject(error);
        else resolve(array);
        cleanup();
      }
  
      function onClose() {
        resolve(array);
        cleanup();
      }
  
      function cleanup() {
        stream.removeListener("data", onData);
        stream.removeListener("end", onEnd);
        stream.removeListener("error", onEnd);
        stream.removeListener("close", onClose);
      }
  
      stream.on("data", onData);
      stream.on("end", onEnd);
      stream.on("error", onEnd);
      stream.on("close", onClose);
    });
  }
  
  async getTriggered(triggered) {
    
    const imgTitle = new Canvas.Image();
    const imgTriggered = new Canvas.Image();
    const encoder = new GIFEncoder(256, 256);
    const canvas = new Canvas.createCanvas(256, 256);
    const ctx = canvas.getContext("2d");
    
    imgTitle.src = await readFile("./assets/images/plate_triggered.png");
    imgTriggered.src = await snek.get(triggered).then(res => res.body);
    
    const stream = encoder.createReadStream();
    encoder.start();
    encoder.setRepeat(0);
    encoder.setDelay(50);
    encoder.setQuality(200);
    
    const coord1 = [-25, -33, -42, -14];
    const coord2 = [-25, -13, -34, -10];
    
    // await this.client.wait(60000);
    for (let i = 0; i < 4; i++) {
      ctx.drawImage(imgTriggered, coord1[i], coord2[i], 300, 300);
      ctx.fillStyle = "rgba(255 , 100, 0, 0.4)";
      ctx.drawImage(imgTitle, 0, 218, 256, 38);
      ctx.fillRect(0, 0, 256, 256);
      encoder.addFrame(ctx);
    }
  
    encoder.finish();
    return this.streamToArray(stream).then(Buffer.concat);
  }

}
module.exports = Triggered;