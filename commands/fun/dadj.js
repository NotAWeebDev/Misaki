const Social = require("../../base/Social.js");
const { get } = require("snekfetch");

class DadJoke extends Social {
  constructor(...args) {
    super(...args, {
      name: "dad",
      description: "This command will give you a terrible dad joke.",
      usage: "dad",
      category: "Fun",
      cost: 5,
      aliases: ["dadjoke", "ugh"],
      loadingString: "<a:typing:397490442469376001> **{{displayName}}** is trying to think of something funny..."
    });
  }

  async run(message, args, level, loadingMessage) {
    const { text } = await get("https://icanhazdadjoke.com/").set("Accept", "text/plain");
    const embed = new this.client.methods.Embed()
      .setThumbnail("https://cdn.discordapp.com/emojis/397910503013220354.png")
      .setDescription(`_${text}_`)
      .setColor(message.guild.me.roles.highest.color || 5198940);

    await loadingMessage.edit({ embed });
  }
}

module.exports = DadJoke;
