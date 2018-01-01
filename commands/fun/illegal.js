const Social = require(`${process.cwd()}/base/Social.js`);
const { get, post } = require("snekfetch");
const inUse = new Map();

class IsNowIllegal extends Social {
  constructor(client) {
    super(client, {
      name: "illegal",
      description: "US President Trump makes something illegal.",
      usage: "illegal <thing>",
      category:"Fun",
      extended: "Powered by IsNowIllegal.com, get US President Trump to make anything illegal.",
      cost: 5,
      cooldown: 10,
      aliases:["trump", "sign"],
      botPerms: ["ATTACH_FILES"]
    });
  }

  async run(message, args, level) { // eslint-disable-line no-unused-vars 
    if (inUse.get("true")) return message.response(undefined, "Trump is currently making something illegal, please wait.");
    inUse.set("true", { user: message.author.id });
    const word = args.join(" ");
    const wordMatch = /^[a-zA-Z\s]{1,10}$/.exec(word);
    if (word.length < 1 || word.length > 10) {
      inUse.delete("true");
      message.response(undefined, "Cannot be longer than 10 characters or shorter than 1 character.");
    }
    if (!wordMatch) {
      inUse.delete("true");
      message.response(undefined, "oops! Non-standard unicode characters are now illegal.");
    }
    try {
      const cost = this.cmdDis(this.help.cost, level);
      const payMe = await this.cmdPay(message, message.author.id, cost, this.conf.botPerms);
      if (!payMe) return;  
      const msg = await message.channel.send(`Convincing Trump that ${word} should be illegal...`);
      message.channel.startTyping();
      await post("https://is-now-illegal.firebaseio.com/queue/tasks.json").send({ task: "gif", word: word.toUpperCase() });
      await this.client.wait(5000);
      const result = await get(`https://is-now-illegal.firebaseio.com/gifs/${word.toUpperCase()}.json`);
      await message.channel.send({ "files": [result.body.url] });
      message.channel.stopTyping({force:true});
      await msg.delete();
      inUse.delete("true");
    } catch (error) {
      inUse.delete("true");
      message.channel.stopTyping({force:true});
      this.client.logger.error(error);
    }
  }
}

module.exports = IsNowIllegal;