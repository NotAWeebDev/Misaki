const Social = require(`${process.cwd()}/base/Social.js`);
const { get } = require("snekfetch");
const { MessageEmbed } = require("discord.js");

class PunJoke extends Social {
  constructor(client) {
    super(client, {
      name: "pun",
      description: "This command will give you a terrible pun.",
      usage: "pun",
      category: "Fun",
      cost: 5,
      aliases: ["punny"]
    });
  }

  async run(message, args, level) { // eslint-disable-line no-unused-vars
    const msg = await message.channel.send(`<a:typing:397490442469376001> **${message.member.displayName}** is trying to think of something punny...`);
    const { text } = await get("https://getpuns.herokuapp.com/api/random");
    const embed = new MessageEmbed()
      .setThumbnail("https://cdn.discordapp.com/emojis/257279894885498890.png")
      .setDescription(`_${JSON.parse(text).Pun}_`)
      .setColor(message.guild.me.roles.highest.color || 5198940);

    await msg.edit({embed});
  }
}

module.exports = PunJoke;
