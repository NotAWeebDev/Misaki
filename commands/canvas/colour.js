const Social = require("../../structures/Social.js");
const { MessageAttachment } = require("discord.js");

class Colour extends Social {
  constructor(...args) {
    super(...args, {
      name: "colour",
      description: "Display a colour image with any supplied HEX, RGB or RGBA colour code.",
      usage: "colour <HEX | RGB | RGBA>",
      category: "Canvas",
      cost: 5,
      loadingString: "<a:typing:397490442469376001> **{{displayName}}** is painting the canvas...",
      aliases: ["color"],
      botPerms: ["ATTACH_FILES"]
    });
  }

  cmdVerify(message, args, loadingMessage) {
    if (args.length < 1) return Promise.reject(new this.client.methods.errors.UsageError("You need to give me a colour to show.", loadingMessage));
    return Promise.resolve();
  }

  async run(message, args, level, loadingMessage) { // eslint-disable-line no-unused-vars 
    await message.channel.send(new MessageAttachment(await this.client.idiotAPI.colour(args.join(" ")),"colour.png"));
    await loadingMessage.delete();
  }

}
module.exports = Colour;
