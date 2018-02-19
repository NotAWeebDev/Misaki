const Social = require(`${process.cwd()}/base/Social.js`);
const snekfetch = require("snekfetch");

class Gelbooru extends Social {
  constructor(client) {
    super(client, {
      name: "gelbooru",
      description: "Searches gelbooru for your search term.",
      category: "NSFW",
      usage: "gelbooru <search term>",
      extended: "This command will return a random result from gelbooru.",
      cost: 40,
      cooldown: 10,
      aliases: ["gb", "gel"]
    });
  }

  getRating(rating) {
    if (rating === "s") return "Safe";
    if (rating === "q") return "Questionable";
    if (rating === "e") return "Explicit";
    if (rating === "u") return "Unrated";
  }

  async run(message, args, level) { // eslint-disable-line no-unused-vars
    const blacklist = ["loli", "shota", "cub", "young", "child", "baby", "guro", "gore", "vore"];
    const tags = args.join("_");
    let msg;
    try {
      if (!message.channel.nsfw) return message.response("🔞", "Cannot display NSFW content in a SFW channel.");
      msg = await message.channel.send(`<a:typing:397490442469376001> **${message.member.displayName}** is checking out ${tags.length === 0 ? "something" : tags}...`);
      const { body } = await snekfetch.get(`https://gelbooru.com/index.php?page=dapi&s=post&q=index&limit=100&tags=${encodeURI(`${tags}+rating:explicit`)}&json=1`);
      const result = body.random();
      if (!result) return msg.edit(`Cannot find results for \`${tags}\`.`);
      const tagString = result.tags.split(" ");
      if (tagString.length !== 0) {
        if (tagString.some(t => blacklist.includes(t.toLowerCase()))) return msg.edit(`${message.author} \`|📛|\` Blacklisted word found, aborting...`);
      }
      
      if (message.settings.socialSystem === "true") {
        if (!(await this.cmdPay(message, message.author.id, this.help.cost))) return;
      }


      await msg.edit({
        embed: {
          "title": "Click here if the image failed to load.",
          "url": `https://gelbooru.com/index.php?page=post&s=view&id=${result.id}`,
          "description": `Owned by ${result.owner}`,
          "color": message.guild.me.roles.highest.color || 5198940,
          "image": {
            "url": result.file_url
          },
          "footer": {
            "text": `Score: ${result.score} | Rating: ${this.getRating(result.rating)}`
          },
          "timestamp": new Date(result.created_at * 1000)
        }
      });
    } catch (e) {
      msg.edit("Something went wrong, please try again later");
      console.log(e);
    }
  }
}

module.exports = Gelbooru;
