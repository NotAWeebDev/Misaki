const Social = require(`${process.cwd()}/base/Social.js`);
const snekfetch = require("snekfetch");

class Reddit extends Social {
  constructor(client) {
    super(client, {
      name: "reddit",
      description: "Posts a random subreddit entry.",
      usage: "reddit [-new|-random|-hot|-top] [subreddit]",
      category: "Fun",
      cost: 10,
      cooldown: 25      
    });
  }

  async run(message, args, level) { // eslint-disable-line no-unused-vars
    const subreddit = args.join(" ") || "random";
    const subRedCat = message.flags[0] || "random";
    let msg;
    try {
      msg = await message.channel.send("Fetching from reddit...");
      const { body } = await snekfetch.get(`https://www.reddit.com/r/${subreddit}/${subRedCat}.json`);
      let meme;
      if (body[0]) {
        meme = body[0].data.children[Math.floor(Math.random() * body[0].data.children.length)].data;
      } else {
        meme = body.data.children[Math.floor(Math.random() * body.data.children.length)].data;
      }
      
      if (!message.channel.nsfw && meme.over_18) {
        message.response("🔞", "Cannot display NSFW content in a SFW channel.");
        return;
      }
      if (message.settings.socialSystem === "true") {
        if (!(await this.cmdPay(message, message.author.id, this.help.cost))) return;
      }
      await message.channel.send(`${meme.title} submitted by ${meme.author} in ${meme.subreddit_name_prefixed}\nUpvote Ratio ${meme.upvote_ratio}\n${meme.url}`);
      msg.delete();
    } catch (error) {
      msg.edit(`Something went wrong, incorrect usage prehaps? \`${this.help.usage}\``);
      console.log(error);
      this.client.logger.error(error);
    }
  }
}

module.exports = Reddit;