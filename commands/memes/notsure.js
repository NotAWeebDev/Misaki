const Social = require(`${process.cwd()}/base/Social.js`);
const snekfetch = require("snekfetch");
const { URLSearchParams } = require("url");

class Notsure extends Social {
  constructor(client) {
    super(client, {
      name: "notsure",
      description: "Express your indecision with Philip J Fry!",
      usage: "notsure <top text ; bottom text>",
      category: "meme",
      cost: 5,
      aliases: ["fry"]
    });
  }

  async run(message, args, level) { // eslint-disable-line no-unused-vars
    const meme = args.join(" ");
    if (meme.length < 5) return message.response(undefined, `Invalid Command usage: \`${this.help.usage}\``);
    const msg = await message.channel.send(`<a:typing:397490442469376001> **${message.member.displayName}** isn't sure...`);
    let topFry;
    let bottomFry;

    if (meme.includes("; ")) {
      [topFry, bottomFry] = meme.split("; ");
    } else {
      topFry = meme;
      bottomFry = "";
    }

    const params = new URLSearchParams();
    params.append("template_id", 61520);
    params.append("username", this.client.config.imgflipUser);
    params.append("password", this.client.config.imgflipPass);
    params.append("text0", topFry);
    params.append("text1", bottomFry);

    const { body } = await snekfetch.post(`https://api.imgflip.com/caption_image?${params}`);
    message.buildEmbed()
      .setColor(message.guild.member(this.client.user.id).highestRole.color || 0)
      .setImage(body.data.url)
      .setFooter(`Powered by imgflip.com, requested by ${message.member.displayName}`, message.author.displayAvatarURL())
      .setTimestamp()
      .send();
    await msg.delete();
  }
}
module.exports = Notsure;