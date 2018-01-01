/*

  This is a modified FML command thanks to Stitch <@257847417183928320>
  for supplying the updated code.

*/
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
      cost: 5,
      cooldown: 10,
      aliases: ["fuckmylife", "fuckme"],
      botPerms: ["EMBED_LINKS"]
    });
  }

  async run(message, args, level) { // eslint-disable-line no-unused-vars 
    try {
      const cost = this.cmdDis(this.help.cost, level);
      const payMe = await this.cmdPay(message, message.author.id, cost, this.conf.botPerms);
      if (!payMe) return;  
      const reply = await message.channel.send("```Searching for a random FML card (this can take a few seconds)```");
      const res = await request.get("http://www.fmylife.com/random");
      const root = HTMLParser.parse(res.text);
      const article = root.querySelector(".block a");
      const downdoot = root.querySelector(".vote-down");
      const updoot = root.querySelector(".vote-up");
      const href = root.querySelector(".panel-content p.block a");
      const card = root.querySelector(".panel-content div.votes span.vote div");
      const signature = root.querySelector(".panel div.text-center");
      const link = "http://www.fmylife.com" + href.rawAttrs.replace(/^href=|"/g,"");
      const cardId = card.rawAttrs.replace(/\D/g,"");
      let signatureDisplay = "Author and date of this fml unknown";
      if (signature.childNodes.length === 1) {
        signatureDisplay = signature.childNodes[0].text;
      } else if (signature.childNodes.length === 3) {
        signatureDisplay = signature.childNodes[0].text.replace("-", "/") + signature.childNodes[2].text.replace("/","");
      }
  
      const embed = new MessageEmbed()
        .setTitle(`FML #${cardId}`)
        .setURL(link)
        .setColor(165868)
        .setThumbnail("http://i.imgur.com/5cMj0fw.png")
        .setFooter(signatureDisplay)
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