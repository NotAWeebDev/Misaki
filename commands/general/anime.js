/*

  All credits for the core of this command go to Yukine <@184632227894657025>
  You can find his repo here; https://github.com/Dev-Yukine

*/
const Command = require(`${process.cwd()}/base/Command.js`);
const { Collection } = require("discord.js");
const Kitsu = require("kitsu");
const kitsu = new Kitsu();

class Anime extends Command {
  constructor(client) {
    super(client, {
      name: "anime",
      description: "Search for an anime on Kitsu!",
      category: "General",
      usage: "anime attack on titan",
      cooldown: 10,
      guildOnly: true,
    });
  }

  async run(message, args, level) { // eslint-disable-line no-unused-vars
    function filter(msg) {
      if (msg.author.id !== message.author.id) return false;
      return ["1", "2", "3", "4", "5"].includes(msg.content);
    }
    if (args.length < 1) return message.reply("You must add an anime to search for");
    let msg = await message.channel.send("*fetching information from kitsu!*");
    try {
      const { data } = await kitsu.fetch("anime", { filter: { text: args.join("-") } });
      msg = await msg.edit(`Okay i found 5 possible matches which do you want to see? (just write the first number, it will be canceled after 60 seconds)${this.makeTitles(data)}`);
      const collected = await message.channel.awaitMessages(filter, { max: 20, maxProcessed: 1, time: 60000, errors: ["time"] });
      const returnMessage = collected.first();
      const index = Number(returnMessage.content) - 1;
      if (message.channel.permissionsFor(this.client.user).has("MANAGE_MESSAGES")) await returnMessage.delete(); 
      await msg.edit(`**Title JP:** ${data[index].titles.en_jp}\n**Title English:** ${data[index].titles.en}\n**Type:** ${data[index].subtype}\n**Start Date:** ${data[index].startDate}\n**End Date:** ${data[index].endDate || "in Progress"}\n**PopularityRank:** ${data[index].popularityRank}\n**Link:** <https://kitsu.io/anime/${data[index].id}>\n**Synopsis:** ${data[index].synopsis}`);
    } catch (error) {
      if (error instanceof Collection) return message.reply("command canceled due timer");
      await msg.edit("I had a error while trying to fetch the data from Kitsu Sorry! did you spell the Anime name right?");
      await message.react("❓");
    }
  }
}

module.exports = Anime;