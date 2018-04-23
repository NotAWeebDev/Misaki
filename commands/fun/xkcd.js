const Social = require("../../structures/Social.js");
const { get } = require("snekfetch");

class Xkdc extends Social {
  constructor(...args) {
    super(...args, {
      name: "xkcd",
      description: "Get the daily comic from XKCD",
      category: "Fun",
      usage: "xkcd [r] [f] <num>",
      extended: "Get the daily comic by using the command on its own, to get a random comic add the flag R, to see a selected comic use the flag F with a comic number",
      cost: 10,
      cooldown: 10
    });
  }
  async run(message, args, level) { // eslint-disable-line no-unused-vars
    const inf = await get("https://xkcd.com/info.0.json");
    const ob = await inf.body;
    if (message.flags[0] === "f") {
      if (!args[0]) return message.reply(`Please make a selection between 1 - ${ob.num}`);
      if (args[0].isNumber() !== true) return message.reply("Please make a numerical selection.");
      if (args[0] > ob.num || args[0] <= 0) return message.reply(`Please make a selection between 1 - ${ob.num}`);
      const ef = await get(`https://xkcd.com/${args[0]}/info.0.json`);
      const ab = await ef.body;
      return message.channel.send({"embed": {"author":{"name":"Misaki | XKCD Comics"}, "description":`${ab.title} | #${ab.num}\n${ab.alt}`, "image":{"url":ab.img}}});
    }
    if (message.flags[0] === "r") {
      const rn = this.randomNum(1, ob.num);
      const ef = await get(`https://xkcd.com/${rn}/info.0.json`);
      const ab = await ef.body;
      return message.channel.send({"embed": {"author":{"name":"Misaki | XKCD Comics"}, "description":`${ab.title} | #${ab.num}\n${ab.alt}`, "image":{"url":ab.img}}});
    }
    message.channel.send({"embed": {"author":{"name":"Misaki | Daily XKCD Comics"}, "description":`${ob.title} | #${ob.num}\n${ob.alt}`, "image":{"url":ob.img}}});
  }

  randomNum(min, max) {
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
}

module.exports = Xkdc;
