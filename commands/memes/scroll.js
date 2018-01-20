const Social = require(`${process.cwd()}/base/Social.js`);
const snekfetch = require("snekfetch");
const { URLSearchParams } = require("url");

class Scroll extends Social {
  constructor(client) {
    super(client, {
      name: "scroll",
      description: "Discover the scroll of truth!",
      usage: "scroll <top text ; bottom text>",
      category: "meme",
      cost: 5,
      aliases: []
    });
  }

  async run(message, args, level) { // eslint-disable-line no-unused-vars
    const meme = args.join(" ");
    if (meme.length < 5) return message.response(undefined, `Invalid Command usage: \`${this.help.usage}\``);
    const msg = await message.channel.send(`<a:typing:397490442469376001> **${message.member.displayName}** discovers the scroll of truth...`);
    let topScroll;
    let bottomScroll;
    if (meme.includes("; ")) {
      [topScroll, bottomScroll] = meme.split("; ");
    } else {
      topScroll = meme;
      bottomScroll = "";
    }
    const params = new URLSearchParams();
    params.append("template_id", 123999232);
    params.append("username", this.client.config.imgflipUser);
    params.append("password", this.client.config.imgflipPass);
    params.append("text0", topScroll);
    params.append("text1", bottomScroll);

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
module.exports = Scroll;