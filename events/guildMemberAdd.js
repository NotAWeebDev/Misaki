const Event = require("../structures/Event.js");
const { MessageAttachment } = require("discord.js");

module.exports = class extends Event {

  async run(member) {
    if (!member || !member.id || !member.guild) return;
    const settings = this.client.getSettings(member.guild.id);
    const channel = member.guild.channels.find("name", settings.welcomeChannel);
    
    if (!channel) return;
    if (!settings.welcomeEnabled) return;
    if (settings.welcomeType === "text") {
      const message = this.client.responses.welcomeMessages.random()
        .replaceAll("{{user}}", member.user.username)
        .replaceAll("{{amount}}", member.guild.memberCount)
        .replaceAll("{{guild}}", member.guild.name).trim();
      channel.send(`${this.client.emojis.get("396391329367588878")} ${message}`).catch(console.error);
    }

    if (settings.welcomeType === "image") {
      const image = await this.client.idiotAPI.welcome("anime", member.user.bot, member.user.displayAvatarURL({ format: "png", size: 128 }), encodeURIComponent(member.user.tag));
      channel.send(new MessageAttachment(image)).catch(console.error);
    }
  }
};
