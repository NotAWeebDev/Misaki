const Social = require("../../structures/Social.js");
const { get } = require("snekfetch");
const { MessageEmbed } = require("discord.js");

class Oneliner extends Social {
  constructor(...args) {
    super(...args, {
      name: "joke",
      description: "This command will give you a one liner joke.",
      usage: "joke",
      category: "Fun",
      cost: 5,
      aliases: ["1l", "oneliner"],
      loadingString: "<a:typing:397490442469376001> **{{displayName}}** is thinking of something funny...",
      botPerms: ["EMBED_LINKS"]
    });
  }

  async run(message, args, level, loadingMessage) {
    const { body } = await get("https://dashboard.typicalbot.com/api/v1/joke").set("Authorization", process.env.TYPICAL);
    const embed = new MessageEmbed()
      .setThumbnail("https://cdn.discordapp.com/emojis/397910503013220354.png")
      .setDescription(`_${body.data}_`)
      .setColor(message.guild ? message.guild.me.roles.highest.color : 5198940)
      .setFooter("Powered by TypicalBot API.");
    await loadingMessage.edit({ embed });
  }
}

module.exports = Oneliner;
