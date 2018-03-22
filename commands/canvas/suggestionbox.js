const Social = require(`${process.cwd()}/base/Social.js`);
const { MessageAttachment } = require("discord.js");

class SuggestionBox extends Social {
  constructor(client) {
    super(client, {
      name: "suggest",
      description: "Leave a suggestion.",
      category: "Canvas",
      usage: "suggest",
      cost: 10,
      cooldown: 10
    });
  }

  async run(message, args, level) { // eslint-disable-line no-unused-vars
    let msg;
    let text = args.join(" ");
    if (text.length < 1) return message.response(undefined, "You must give a suggestion.");
    
    try {
      if (message.settings.socialSystem === "true") {
        if (!(await this.cmdPay(message, message.author.id, this.help.cost))) return;
      }
      msg = await message.channel.send(`<a:typing:397490442469376001> **${message.member.displayName}** is leaving a suggestion...`);
      if (message.mentions.users.first()) text = text.replace(/<@!?\d+>/, "").replace(/\n/g, " ").trim();
      await message.channel.send(new MessageAttachment(await this.client.idiotAPI.suggestion(message.author.displayAvatarURL({ format: "png", size: 256 }), text), "suggest.png"));
      await msg.delete();
    } catch (error) {
      msg.edit("Something went wrong, please try again later");
      this.client.logger.error(error);
    }
  }

  
}

module.exports = SuggestionBox;