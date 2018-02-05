const Social = require(`${process.cwd()}/base/Social.js`);
const { get } = require("snekfetch");
const { MessageAttachment } = require("discord.js");
class Tiger extends Social {
  constructor(client) {
    super(client, {
      name: "tiger",
      description: "Post a randomly selected image of a tiger.",
      category: "Animals",
      usage: "tiger",
      extended: "This command will return a beautiful tiger.",
      cost: 5,
      cooldown: 10,
      aliases: ["tigger"]
    });
  }

  async run(message, args, level) { // eslint-disable-line no-unused-vars
    const msg = await message.channel.send(`<a:typing:397490442469376001> **${message.member.displayName}** is petting a tiger...`);

    if (message.settings.socialSystem === "true") {
      await this.cmdPay(message, message.author.id, this.help.cost, { msg });
    }

    const { body } = await get("https://dashboard.typicalbot.com/api/v1/tiger").set("Authentication", this.client.config.tbToken);
    await message.channel.buildEmbed()
      .setColor(message.guild.me.roles.highest.color || 5198940)
      .attachFiles([new MessageAttachment(new Buffer(body.data), "image.png")])
      .setImage("attachment://image.png")
      .send();
    await msg.delete();
  }
}

module.exports = Tiger;