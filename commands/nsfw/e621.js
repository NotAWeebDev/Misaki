const Social = require(`${process.cwd()}/base/Social.js`);
const snekfetch = require("snekfetch");

class E621 extends Social {
  constructor(client) {
    super(client, {
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
    try {
      if (!message.channel.nsfw) return message.response("🔞", "Cannot display NSFW content in a SFW channel.");
      const msg = await message.channel.send(`<a:typing:397490442469376001> **${message.member.displayName}** is checking out ${args.length === 0 ? " " : `${args.join(" ")} on `}e621.net...`);

      const { body } = await snekfetch.get(`https://e621.net/post/index.json?limit=100&tags=${encodeURI(args)}`);
      const result = body.random();
      if (result.tags.split(" ").some(t => blacklist.includes(t.toLowerCase()))) return message.response("📛", "Blacklisted word found, aborting...");
      
      if (message.settings.socialSystem === "true") {
        if (!(await this.cmdPay(message, message.author.id, this.help.cost))) return;
      }


      await msg.edit({
        embed: {
          "title": "Click here if the image failed to load.",
          "url": `https://e621.net/post/show/${result.id}`,
          "description": `Created by ${result.artist[0]}\n**Description:** ${result.description}`,
          "color": message.guild.me.roles.highest.color || 5198940,
          "image": {
            "url": result.file_url
          },
          "timestamp": new Date(result.created_at["s"] * 1000)
        }
      });
    } catch (e) {
      console.log(e);
    }
  }
}

module.exports = E621;
