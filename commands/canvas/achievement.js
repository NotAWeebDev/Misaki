const Social = require(`${process.cwd()}/base/Social.js`);
const { MessageAttachment } = require("discord.js");

class Achievement extends Social {
  constructor(client) {
    super(client, {
      name: "achievement",
      description: "Creates an Achievement.",
      category: "Canvas",
      usage: "achievement",
      extended: "Either mention a user with text to give the achievement their user avatar, or just supply text for your own achievement.",
      cost: 10,
      cooldown: 10,
      aliases: ["get", "achieveget", "achievementget"]
    });
  }

  async run(message, args, level) { // eslint-disable-line no-unused-vars
    let msg;
    let text = args.join(" ");
    if (text.length < 1) return message.response(undefined, "You must give an achievement description.");
    if (text.length > 22) return message.response(undefined, "I can only handle a maximum of 22 characters");
    
    try {
      if (message.settings.socialSystem === "true") {
        if (!(await this.cmdPay(message, message.author.id, this.help.cost))) return;
      }
      msg = await message.channel.send(`<a:typing:397490442469376001> **${message.member.displayName}** is getting an achievement...`);
      if (message.mentions.users.first()) text = text.replace(/<@!?\d+>/, "").replace(/\n/g, " ").trim();
      await message.channel.send(new MessageAttachment(await this.client.idiotAPI.achievement((message.mentions.users.first() || message.author).displayAvatarURL({ format:"png", size:32 }), text), "achievement.png"));
      await msg.delete();
    } catch (error) {
      msg.edit("Something went wrong, please try again later");
      this.client.logger.error(error);
    }
  }

  
}

module.exports = Achievement;