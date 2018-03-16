const Event = require("../base/Event.js");

module.exports = class extends Event {

  async run(member) {
    if (!member || !member.id || !member.guild) return;
    
    if (!member.user.bot) this.client.points.set(`${member.guild.id}-${member.id}`, { points: 0, level:0, user: member.id, guild: member.guild.id, daily: 1504120109 });

    const settings = this.client.getSettings(member.guild.id);
    
    if (settings.welcomeEnabled !== "true") return;
    if (settings.welcomeType === "text") member.guild.channels.find("name", settings.welcomeChannel).send(`${this.client.emojis.get("396391329367588878")}  ${this.client.responses.welcomeMessages.random().replaceAll("{{user}}", member.user.username).replaceAll("{{amount}}", member.guild.memberCount).replaceAll("{{guild}}", member.guild.name).trim()}`).catch(console.error);
    if (settings.welcomeType === "image") member.guild.channels.find("name", settings.welcomeChannel).send(new this.client.methods.Attachment(await this.client.idiotAPI.welcome("anime", member.user.bot, member.user.displayAvatarURL({ format: "png", size: 128 }), encodeURIComponent(member.user.tag), null, null))).catch(console.error);
  }
};
