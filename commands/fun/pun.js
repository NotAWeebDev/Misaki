const Social = require("../../structures/Social.js");
const { get } = require("snekfetch");
const { MessageEmbed } = require("discord.js");

class PunJoke extends Social {
  constructor(...args) {
    super(...args, {
      name: "pun",
      description: "This command will give you a terrible pun.",
      usage: "pun",
      category: "Fun",
      cost: 5,
      aliases: ["punny"],
      loadingString: "<a:typing:397490442469376001> **{{displayName}}** is trying to think of something punny..."
    });
  }

  async run(message, args, level, loadingMessage) {
    const { text } = await get("https://getpuns.herokuapp.com/api/random");
    const embed = new MessageEmbed()
      .setThumbnail("https://cdn.discordapp.com/emojis/257279894885498890.png")
      .setDescription(`_${JSON.parse(text).Pun}_`)
      .setColor(6192321);

    await loadingMessage.edit({ embed });
  }
}

module.exports = PunJoke;
