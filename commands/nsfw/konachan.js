const Social = require(`${process.cwd()}/base/Social.js`);
const snekfetch = require("snekfetch");

class Konachan extends Social {
  constructor(client) {
    super(client, {
      name: "konachan",
      description: "Searches konachan.com for your search term.",
      category: "NSFW",
      usage: "konachan <search term>",
      extended: "This command will return a random result from konachan.",
      cost: 40,
      cooldown: 10,
      aliases: ["kona", "kc", "konac"]
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

      const { body } = await snekfetch.get(`http://konachan.com/post.json?limit=100&tags=${encodeURI(`${tags}+rating:e`)}`);
      const result = body.random();
      if (!result) return msg.edit(`Cannot find results for \`${tags}\`.`);
      if (result.tags.length !== 0) {
        if (result.tags.split(" ").some(t => blacklist.includes(t.toLowerCase()))) return msg.edit(`${message.author} \`|📛|\` Blacklisted word found, aborting...`);
      }
      
      if (message.settings.socialSystem === "true") {
        if (!(await this.cmdPay(message, message.author.id, this.help.cost))) return;
      }


      await msg.edit({
        embed: {
          "title": "Click here if the image failed to load.",
          "url": `http://konachan.com/post/show/${result.id}`,
          "description": `Created by ${result.author}`,
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

module.exports = Konachan;
