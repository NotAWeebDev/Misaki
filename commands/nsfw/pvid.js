const Social = require("../../structures/Social.js");
const pSearch = require("pornsearch");

class PVid extends Social {
  constructor(...args) {
    super(...args, {
      name: "pvid",
      description: "This command will return porn in gif form.",
      category: "NSFW",
      usage: "pvid [search term]",
      cost: 40,
      cooldown: 10,
      loadingString: "<a:typing:397490442469376001> **{{displayName}}** is looking for porn videos..."
    });
  }

  async run(message, args, level, loadingMessage) { // eslint-disable-line no-unused-vars
    const blacklist = ["loli", "shota", "cub", "young", "child", "baby", "guro", "gore", "vore"];
    if (!message.channel.nsfw) return message.response("🔞", "Cannot display NSFW content in a SFW channel.");
    if (args.length !== 0) {
      if (args.some(t => blacklist.includes(t.toLowerCase()))) return loadingMessage.edit(`${message.author} \`|📛|\` Blacklisted word found, aborting...`);
    }

    const search = new pSearch(args.join(" "));
    const videos = await search.videos();
    const video = videos.random();

    await loadingMessage.edit({
      embed: {
        "title": video.title,
        "url": video.url,
        "color": 6192321,
        "image": {
          "url": video.thumb
        },
        "footer": {
          "icon_url": message.author.displayAvatarURL({ format: "png", size: 32 }),
          "text": `Length: ${video.duration} | Requested by ${message.author.tag}`
        }
      }
    });
  }
}

module.exports = PVid;