const Social = require(`${process.cwd()}/base/Social.js`);
const snek = require("snekfetch");
class Xkdc extends Social {
  constructor(client) {
    super(client, {
      name: "xkdc",
      description: "Get the daily comic from XKDC",
      category: "Fun",
      usage: "xkdc [r] [f] <num>",
      extended: "Get the daily comic by using the command on its own, to get a random comic add the flag R, to see a selected comic use the flag F with a comic number",
      usage: "xkdc",

      cooldown: 10,
      botPerms: ["EMBED_LINKS"]
    });
  }
  async run(message, args, level) { // eslint-disable-line no-unused-vars
    const inf = await snek.get("https://xkcd.com/info.0.json");
    const ob = await inf.body;
    if (message.flags[0] == "f") {
      if (args[0] == undefined) return message.reply(`Please make a selection between 1 - ${ob.num}`);
      if (args[0].isNumber() !== true) return message.reply("Please make a numerical selection.");
      if (args[0] > ob.num || args[0] <= 0) return message.reply(`Please make a selection between 1 - ${ob.num}`);
      const ef = await snek.get(`https://xkcd.com/${args[0]}/info.0.json`);
      const ab = await ef.body;
      return message.channel.send({"embed": {"author":{"name":"Okami | XKDC Comics"}, "description":`${ab.title} | #${ab.num}\n${ab.alt}`, "image":{"url":ab.img}}});
    }
    if (message.flags[0] == "r") {
      const rn = await this.client.randomNum(1, ob.num);
      const ef = await snek.get(`https://xkcd.com/${rn}/info.0.json`);
      const ab = await ef.body;
      return message.channel.send({"embed": {"author":{"name":"Okami | XKDC Comics"}, "description":`${ab.title} | #${ab.num}\n${ab.alt}`, "image":{"url":ab.img}}});
    }
    message.channel.send({"embed": {"author":{"name":"Okami | Daily XKDC Comics"}, "description":`${ob.title} | #${ob.num}\n${ob.alt}`, "image":{"url":ob.img}}});
  }
}

module.exports = Xkdc;
