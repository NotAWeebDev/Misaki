const Social = require("../../structures/Social.js");
const request = require("snekfetch");
const HTMLParser = require("fast-html-parser");

class FML extends Social {
  constructor(...args) {
    super(...args, {
      name: "fml",
      description: "Grabs a random fml story.",
      usage: "fml",
      category: "Fun",
      extended: "This command grabs a random \"fuck my life\" story from fmylife.com and displays it in an organised embed.",
      cost: 10,
      cooldown: 10,
      aliases: ["fuckmylife", "fuckme"],
      loadingString: "<a:typing:397490442469376001> **Searching** please wait a few moments."
    });
  }

  async run(message, args, level, loadingMassage) {
    const { text } = await request.get("http://www.fmylife.com/random");
    const root = HTMLParser.parse(text);
    const article = root.querySelector(".block a");
    const downdoot = root.querySelector(".vote-down");
    const updoot = root.querySelector(".vote-up");
    const embed = new this.client.methods.Embed()
      .setTitle("Fuck my Life, Random Edition!")
      .setColor(165868)
      .setThumbnail("http://i.imgur.com/5cMj0fw.png")
      .setFooter(`Requested by: ${message.member.displayName}`)
      .setDescription(`_${article.childNodes[0].text}\n\n_`)
      .addField("I agree, your life sucks", updoot.childNodes[0].text, true)
      .addField("You deserved it:", downdoot.childNodes[0].text, true);
    if (article.childNodes[0].text.length < 5) throw new this.client.methods.errors.APIError("Today, something went wrong, so you'll have to try again in a few moments. FML", loadingMassage);
    loadingMassage.edit({ embed });
  }
}

module.exports = FML;