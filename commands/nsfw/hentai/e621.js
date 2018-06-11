const Social = require("../../../structures/Social.js");
const { get } = require("snekfetch");

class E621 extends Social {
  constructor(...args) {
    super(...args, {
      name: "e621",
      description: "Searches e621.net for your search term.",
      category: "NSFW",
      usage: "e621 <search term>",
      extended: "This command will return a random result from e621.",
      cost: 40,
      cooldown: 10,
      aliases: ["e6"]
    });
  }

  async run(message, args, level) { // eslint-disable-line no-unused-vars
    const blacklist = ["loli", "shota", "cub", "young", "child", "baby", "guro", "gore", "vore"];
    if (!message.channel.nsfw) return message.response("🔞", "Cannot display NSFW content in a SFW channel.");
    const msg = await message.channel.send(`<a:typing:397490442469376001> **${message.member.displayName}** is checking out ${args.length === 0 ? " " : `${args.join(" ")} on `}e621.net...`);

    const { body } = await get(`https://e621.net/post/index.json?limit=100&tags=${encodeURI(args)}`);
    const result = body.random();
    if (result.tags.split(" ").some(t => blacklist.includes(t.toLowerCase()))) return message.response("📛", "Blacklisted word found, aborting...");

    await msg.edit({
      embed: {
        "title": "Click here if the image failed to load.",
        "url": `https://e621.net/post/show/${result.id}`,
        "description": `Created by ${result.artist[0]}\n**Description:** ${result.description}`,
        "color": 6192321,
        "image": {
          "url": result.file_url
        },
        "timestamp": new Date(result.created_at["s"] * 1000)
      }
    });
  }
}

module.exports = E621;
