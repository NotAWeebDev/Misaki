const Social = require(`${process.cwd()}/base/Social.js`);
const { MessageAttachment } = require("discord.js");

class SnapChat extends Social {
  constructor(client) {
    super(client, {
      name: "snapchat",
      description: "Creates a snapchat based meme.",
      usage: "snapchat <text>",
      category: "Canvas",
      extended: "This command uses canvas to generate a Snapchat styled image based on the well known statue meme.",
      cost: 10,
      cooldown: 10,
      aliases: ["sc"]
    });
  }

  async run(message, args, level) { // eslint-disable-line no-unused-vars 
    const msg = await message.channel.send(`<a:typing:397490442469376001> **${message.member.displayName}** is applying filters...`);
    let text = args.join(" ");

    if (text.length < 1) return msg.edit("You must give the snap some text.");
    if (text.length > 28) return msg.edit("I can only handle a maximum of 28 characters.");
    
    if (message.settings.socialSystem === "true") {
      await this.cmdPay(message, message.author.id, this.help.cost, { msg });
    }
    if (message.mentions.users.first()) text = text.replace(/<@!?\d+>/, "").replace(/\n/g, " ").trim();
    await message.channel.send(new MessageAttachment(await this.client.idiotAPI.snapchat(text), "achievement.png"));
    await msg.delete();
  }
}

module.exports = SnapChat;