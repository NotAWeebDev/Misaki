const Social = require("../../structures/Social.js");
const { get } = require("snekfetch");

class Reddit extends Social {
  constructor(...args) {
    super(...args, {
      name: "reddit",
      description: "Posts a random subreddit entry.",
      usage: "reddit [-new|-random|-hot|-top] [subreddit]",
      category: "Fun",
      cost: 10,
      cooldown: 25,
      loadingString: "Fetching from reddit..."  
    });
  }

  async run(message, args, level, loadingMessage) { // eslint-disable-line no-unused-vars
    const subreddit = args.join(" ") || "random";
    const subRedCat = message.flags[0] || "random";
    const { body } = await get(`https://www.reddit.com/r/${subreddit}/${subRedCat}.json`);
    let meme;
    if (body[0]) {
      meme = body[0].data.children[Math.floor(Math.random() * body[0].data.children.length)].data;
    } else {
      meme = body.data.children[Math.floor(Math.random() * body.data.children.length)].data;
    }

    if (!message.channel.nsfw && meme.over_18) return loadingMessage.edit("🔞 Cannot display NSFW content in a SFW channel.");
    await message.channel.send(`${meme.title} submitted by ${meme.author} in ${meme.subreddit_name_prefixed}\nUpvote Ratio ${meme.upvote_ratio}\n${meme.url}`);
    loadingMessage.delete();
  }
}

module.exports = Reddit;