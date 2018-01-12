const Social = require(`${process.cwd()}/base/Social.js`);
const snek = require("snekfetch");

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
      guildOnly: true,
      aliases: []
    });
  }

  async run(message, args, level) { // eslint-disable-line no-unused-vars
    const blacklist = ["loli", "shota", "cub", "young", "child", "baby"];
    try {
      if (!message.channel.nsfw) return message.response("🔞", "Cannot display NSFW content in a SFW channel.");

      const { body } = await snek.get(`https://e621.net/post/index.json?limit=100&tags=${encodeURI(args)}`);
      const result = body.random();
      if (result.tags.split(" ").some(t => blacklist.includes(t.toLowerCase()))) return message.response("📛", "Blacklisted word found, aborting...");
      
      if (!(await this.cmdPay(message, message.author.id, this.help.cost))) return;
      const msg = await message.channel.send(`<a:typing:397490442469376001> **${message.member.displayName}** is checking out ${args.length === 0 ? " " : `${args.join(" ")} on `}e621.net...`);


      // const source = [];
      // const getSources = function(item, index) {
      //   source.push(`[${index}](${item})`);
      // };
      // result.sources.forEach(getSources);
      message.buildEmbed()
        .setTitle(`Created by ${result.author}`)
        .setURL(`https://e621.net/post/show/${result.id}`)
        .setDescription(`**Description:** ${result.description}`)
        .setImage(result.file_url)
        .addField("Tags", result.tags.replaceAll("_", "-"))
        // .addField("Sources", `${source.join(", ")}`)
        .setTimestamp(new Date(result.created_at["s"] * 1000))
        .send();

      await msg.delete();
    } catch (e) {
      console.log(e);
    }
  }
}

module.exports = E621;
