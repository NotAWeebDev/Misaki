const Social = require(`${process.cwd()}/base/Social.js`);
const request = require("snekfetch");
const HTMLParser = require("fast-html-parser");
const {MessageEmbed} = require("discord.js");

class FML extends Social {
  constructor(client) {
    super(client, {
      name: "fml",
      description: "Grabs a random fml story.",
      usage: "fml",
      category: "Fun",
      extended: "This command grabs a random \"fuck my life\" story from fmylife.com and displays it in an organised embed.",
      cost: 10,
      cooldown: 10,
      aliases: ["fuckmylife", "fuckme"]
    });
  }

  async run(message, args, level) { // eslint-disable-line no-unused-vars 
    try {
      if (message.settings.socialSystem === "true") {
        if (!(await this.cmdPay(message, message.author.id, this.help.cost))) return;
      }
      const reply = await message.channel.send("<a:typing:397490442469376001> **Searching** please wait a few moments.");
      const { text } = await request.get("http://www.fmylife.com/random");
      const root = HTMLParser.parse(text);
      const article = root.querySelector(".block a");
      const downdoot = root.querySelector(".vote-down");
      const updoot = root.querySelector(".vote-up");
      const embed = new MessageEmbed()
        .setTitle("Fuck my Life, Random Edition!")
        .setColor(165868)
        .setThumbnail("http://i.imgur.com/5cMj0fw.png")
        .setFooter(`Requested by: ${message.member.displayName}`)
        .setDescription(`_${article.childNodes[0].text}\n\n_`)
        .addField("I agree, your life sucks", updoot.childNodes[0].text, true)
        .addField("You deserved it:", downdoot.childNodes[0].text, true);
      if (article.childNodes[0].text.length < 5 ) {
        return message.response(undefined, "Today, something went wrong, so you'll have to try again in a few moments. FML");
      }
      reply.edit({embed});
    } catch (error) {
      if (error.message === "Cannot send an empty message") {
        message.response(undefined, "Today, something went wrong, so you'll have to try again in a few moments. FML");
      }
      this.client.logger.error(error);
    }
  }
}

module.exports = FML;