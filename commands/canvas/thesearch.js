const Social = require(`${process.cwd()}/base/Social.js`);
const { MessageAttachment } = require("discord.js");

class TheSearch extends Social {
  constructor(client) {
    super(client, {
      name: "thesearch",
      description: "Creates a meme based on a webcomic.",
      category: "Canvas",
      usage: "thesearch <text>",
      cost: 10,
      cooldown: 10,
      aliases: []
    });
  }

  async run(message, args, level) { // eslint-disable-line no-unused-vars
    const msg = await message.channel.send(`<a:typing:397490442469376001> **${message.member.displayName}** is searching...`); 
    let text = args.join(" ");
    if (text.length < 1) return msg.edit("You must give some text.");
    
    if (message.settings.socialSystem === "true") {
      await this.cmdPay(message, message.author.id, this.help.cost, { msg });
    }
    if (message.mentions.users.first()) text = text.replace(/<@!?\d+>/, "").replace(/\n/g, " ").trim();
    await message.channel.send(new MessageAttachment(await this.client.idiotAPI.theSearch((message.mentions.users.first() || message.author).displayAvatarURL({ format:"png", size:128 }), text), "thesearch.png"));
    await msg.delete();
  }
}

module.exports = TheSearch;//