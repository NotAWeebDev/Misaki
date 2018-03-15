const Command = require(`${process.cwd()}/base/Command.js`);
const { MessageEmbed } = require("discord.js");
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

  async run(message, [...text]) { // eslint-disable-line no-unused-vars
    if (!text.length) return message.send(message.getText("MUST_PROVIDE_SEARCH_TERM"));
    const { body } = await snek.get(`http://api.urbandictionary.com/v0/define?term=${text.join(" ")}`);
    if (body.result_type === "no_result") return message.channel.send("No data found...");	
  
    return this.paginate(message, body.list, this.makeEmbed);
  }
  
  makeEmbed(list, page) {    
    let description = list[page].definition;
    description += `\n\n**❯ Example**:\n${list[page].example}`;
		
    return new MessageEmbed()
      .setColor(0x1e90ff)
      .setDescription(description)
      .setThumbnail("https://i.imgur.com/ressY86.png")
      .setTitle(`${list[page].word} - Page ${page+1}/${list.length}`)
      .addField(":thumbsup:", list[0].thumbs_up, true)
      .addField(":thumbsdown:", list[0].thumbs_down, true)
      .addBlankField(true)
      .setURL(`${list[page].permalink}`)
      .setFooter(`Author: ${list[page].author}`);
  }
  

};

