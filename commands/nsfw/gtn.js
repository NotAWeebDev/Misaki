const Social = require(`${process.cwd()}/base/Social.js`);
const { get } = require("snekfetch");

class Gtn extends Social {
  constructor(client) {
    super(client, {
      name: "gtn",
      description: "Displays a random comic by GreenTeaNeko",
      usage: "gtn",
      category: "NSFW",
      cost: 5,
    });
  }

  async run(message, args, level) { // eslint-disable-line no-unused-vars
    if (!message.channel.nsfw) return message.response("🔞", "Cannot display NSFW content in a SFW channel.");
    const msg = await message.channel.send(`<a:typing:397490442469376001> **${message.member.displayName}** wants to read a comic...`);
    const { body } = await get("https://rra.ram.moe/i/r?type=nsfw-gtn&nsfw=true");
    await msg.edit({
      embed: {
        "title": "Click here if the image failed to load.",
        "url": `https://cdn.ram.moe/${body.path.replace("/i/", "")}`,
        "color": message.guild.me.roles.highest.color || 5198940,
        "image": {
          "url": `https://cdn.ram.moe/${body.path.replace("/i/", "")}`
        }
      }
    });

  }
}

module.exports = Gtn;
