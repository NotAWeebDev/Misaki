const Event = require("../structures/Event.js");
const { MessageAttachment } = require("discord.js");

module.exports = class extends Event {

  async run(member) {
    if (!member.guild.available) return;
    if (!member || !member.id || !member.guild) return;
    
    if (!member.user.bot) {
      this.client.points.set(`${member.guild.id}-${member.id}`, { points: 0, level:0, user: member.id, guild: member.guild.id, daily: 1504120109 });
    }

    const settings = this.client.getGuildSettings(member.guild);
    
    if (settings.welcomeEnabled !== "true") return;
    const channel = member.guild.channels.find("name", settings.welcomeChannel);
    if (!channel) return;
    if (settings.welcomeType === "text") {
      const message = this.client.responses.welcomeMessages.random()
        .replaceAll("{{user}}", member.user.username)
        .replaceAll("{{amount}}", member.guild.memberCount)
        .replaceAll("{{guild}}", member.guild.name).trim();
      channel.send(`${this.client.emojis.get("396391329367588878")} ${message}`).catch(console.error);
    }
    if (settings.welcomeType === "image") {
      const image = await this.client.idiotAPI.greeting("welcome", "anime", member.user.bot, member.user.displayAvatarURL({ format: "png", size: 256 }), member.user.username, member.user.discriminator, member.guild.name, member.guild.memberCount, null);
      channel.send(new MessageAttachment(image)).catch(console.error);
    }
  }
};
