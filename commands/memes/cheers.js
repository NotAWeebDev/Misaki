const Social = require(`${process.cwd()}/base/Social.js`);
const snekfetch = require("snekfetch");
const { URLSearchParams } = require("url");

class Cheers extends Social {
  constructor(client) {
    super(client, {
      name: "cheers",
      description: "Say cheers with Leonardo Dicaprio!",
      usage: "cheers <top text ; bottom text>",
      category: "meme",
      cost: 5,
      aliases: []
    });
  }

  async run(message, args, level) { // eslint-disable-line no-unused-vars
    const meme = args.join(" ");
    if (meme.length < 5) return message.response(undefined, `Invalid Command usage: \`${this.help.usage}\``);
    const msg = await message.channel.send(`<a:typing:397490442469376001> **${message.member.displayName}** raises their glass...`);
    let topCheers;
    let bottomCheers;
    if (meme.includes("; ")) {
      [topCheers, bottomCheers] = meme.split("; ");
    } else {
      topCheers = meme;
      bottomCheers = "";
    }
    const params = new URLSearchParams();
    params.append("template_id", 5496396);
    params.append("username", this.client.config.imgflipUser);
    params.append("password", this.client.config.imgflipPass);
    params.append("text0", topCheers);
    params.append("text1", bottomCheers);

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
module.exports = Cheers;