const Command = require("../../base/Command.js");
const snek = require("snekfetch");

module.exports = class UrbanCommand extends Command {

  constructor(...args) {
    super(...args, {
      name: "urban",
      description: "Searches the Urban Dictionary.",
      usage: "urban <search term>",
      aliases: ["ud"]
    });
  }

  async run(message, [...text]) {
    text = text.join(" ");
    if (!text.length) return message.channel.send("You must provide some term to search in urban dictionary.");
    const { body } = await snek.get("http://api.urbandictionary.com/v0/define")
      .query({ term: text });
    if (body.result_type === "no_result") return message.channel.send("No data found...");	
  
    return this.paginate(message, body.list, this.makeEmbed);
  }
  
  makeEmbed(list, page) {    
    let description = list[page].definition;
    description += `\n\n**❯ Example**:\n${list[page].example}`;
		
    return new this.client.methods.Embed()
      .setColor(0x1e90ff)
      .setDescription(description)
      .setThumbnail("https://i.imgur.com/ressY86.png")
      .setTitle(`${list[page].word} - Page ${page+1}/${list.length}`)
      .addField("👍", list[page].thumbs_up, true)
      .addField("👎", list[page].thumbs_down, true)
      .addBlankField(true)
      .setURL(list[page].permalink)
      .setFooter(`Author: ${list[page].author}`);
  }
  

};