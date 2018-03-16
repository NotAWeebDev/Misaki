const Social = require(`${process.cwd()}/base/Social.js`);
const { get } = require("snekfetch");

class Danbooru extends Social {
  constructor(...args) {
    super(...args, {
      name: "danbooru",
      description: "Searches danbooru for your search term.",
      category: "NSFW",
      usage: "danbooru <search term>",
      extended: "This command will return a random result from danbooru.",
      cost: 40,
      cooldown: 10,
      aliases: ["dan", "db"]
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
    const msg = await message.channel.send(`<a:typing:397490442469376001> **${message.member.displayName}** is checking out ${tags.length === 0 ? "something" : tags}...`);
    if (!message.channel.nsfw) return message.response("🔞", "Cannot display NSFW content in a SFW channel.");

    const { body } = await get(`http://danbooru.donmai.us/posts.json?limit=100&tags=${encodeURI(`${tags}+rating:e`)}`);
    const result = body.random();
    if (!result) return msg.edit(`Cannot find results for \`${tags}\`.`);
    const tagString = result.tag_string.split(" ");
    if (tagString.length !== 0) {
      if (tagString.some(t => blacklist.includes(t.toLowerCase()))) return msg.edit(`${message.author} \`|📛|\` Blacklisted word found, aborting...`);
    }

    await msg.edit({
      embed: {
        "title": "Click here if the image failed to load.",
        "url": `http://danbooru.donmai.us/post/show/${result.id}`,
        "color": message.guild.me.roles.highest.color || 5198940,
        "image": {
          "url": `http://danbooru.donmai.us${result.file_url}`
        },
        "footer": {
          "text": `Score: ${result.score} | Rating: ${this.getRating(result.rating)}`
        },
        "timestamp": new Date(result.created_at * 1000)
      }
    });
  }
}

module.exports = Danbooru;
