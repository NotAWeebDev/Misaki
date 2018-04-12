/*
  All credits for the core of this command go to Yukine <@184632227894657025>
  You can find his repo here; https://github.com/Dev-Yukine
*/
const Command = require("../../structures/Command.js");
const Kitsu = require("kitsu");
const kitsu = new Kitsu();
const { Collection } = require("discord.js");

class Manga extends Command {
  constructor(...args) {
    super(...args, {
      name: "manga",
      description: "Search for a manga on Kitsu!",
      category: "Fun",
      usage: "manga attack on titan",
      cooldown: 10,
    });
  }

  async run(message, args, level) { // eslint-disable-line no-unused-vars
    function filter(msg) {
      if (msg.author.id !== message.author.id) return false;
      return ["1", "2", "3", "4", "5"].includes(msg.content);
    }
    if (args.length < 1) return message.reply("You must add a manga to search for");
    let msg = await message.channel.send("*fetching information from kitsu!*");
    try {
      const { data } = await kitsu.fetch("manga", { filter: { text: args.join("-") } });
      if (data.length < 1) throw new this.client.methods.errors.AnimeError("No result found");
      msg = await msg.edit(`Okay I found 5 possible matches which do you want to see? (just write the first number, it will be canceled after 60 seconds)${this.makeTitles(data)}`);
      const collected = await message.channel.awaitMessages(filter, { max: 20, maxProcessed: 1, time: 60000, errors: ["time"] });
      const returnMessage = collected.first();
      const index = Number(returnMessage.content) - 1;
      if (message.channel.permissionsFor(this.client.user).has("MANAGE_MESSAGES")) await returnMessage.delete();
      await msg.edit(`**Title JP:** ${data[index].titles.en_jp}\n**Title English:** ${data[index].titles.en}\n**Type:** ${data[index].subtype}\n**Start Date:** ${data[index].startDate}\n**End Date:** ${data[index].endDate || "in Progress"}\n**PopularityRank:** ${data[index].popularityRank}\n**Link:** <https://kitsu.io/manga/${data[index].id}>\n**Synopsis:** ${data[index].synopsis}`);
    } catch (error) {
      if (error instanceof Collection) return message.reply("command canceled due timer");
      throw error;
    }  
  }

  makeTitles(data) {
    const arr = [];
    for (let i = 0; i < 5; i++) arr.push(`\n${i + 1}: ${this.makeTitle(i, data)}`);
    return arr.join(" ");
  }

  makeTitle(index, data) {
    const line1 = data[index].titles.en_jp ? data[index].titles.en_jp : "";
    const line2 = data[index].titles.en ? `/${data[index].titles.en}` : "";
    return `${line1}${line2}`;
  }
}

module.exports = Manga;
