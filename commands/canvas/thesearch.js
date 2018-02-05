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
    });
  }

  async run(message, args, level) { // eslint-disable-line no-unused-vars
    let msg;
    let text = args.join(" ");
    if (text.length < 1) return message.response(undefined, "You must give some text.");
    
    try {
      if (message.settings.socialSystem === "true") {
        if (!(await this.cmdPay(message, message.author.id, this.help.cost))) return;
      }
      msg = await message.channel.send(`<a:typing:397490442469376001> **${message.member.displayName}** is searching...`);
      if (message.mentions.users.first()) text = text.replace(/<@!?\d+>/, "").replace(/\n/g, " ").trim();
      await message.channel.send(new MessageAttachment(await this.client.idiotAPI.theSearch((message.mentions.users.first() || message.author).displayAvatarURL({ format:"png", size:128 }), text), "thesearch.png"));
      await msg.delete();
    } catch (error) {
      msg.edit("Something went wrong, please try again later");
      this.client.logger.error(error);
    }
  }

  
}

module.exports = TheSearch;//