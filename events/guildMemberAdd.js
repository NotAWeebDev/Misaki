const { get } = require("snekfetch");

module.exports = class {
  constructor(client) {
    this.client = client;
  }

  async run(member) {
    const guild = member.guild;
    if (!member || !member.id || !guild) return;
    const settings = this.client.getSettings(guild.id);
    
    if (!member.user.bot) this.client.points.set(`${guild.id}-${member.id}`, { points: 0, level:0, user: member.id, guild: guild.id, daily: 1504120109 });

    
    if (settings.welcomeEnabled !== "true") return;
    if (settings.welcomeType === "text") member.guild.channels.find("name", settings.welcomeChannel).send(`${this.client.emojis.get("396391329367588878")}  ${this.client.responses.welcomeMessages.random().replaceAll("{{user}}", member.user.username).replaceAll("{{amount}}", guild.memberCount).replaceAll("{{guild}}", guild.name).trim()}`).catch(console.error);

    if (settings.welcomeType === "image") {
      const { body } = await get(`https://dev.anidiots.guide/greetings/anime_welcome/?bot=${member.user.bot}&avatar=${member.user.displayAvatarURL({ format: "png", size: 128 })}&usertag=${encodeURIComponent(member.user.tag)}`).set("Authorization", this.client.config.apiTokens.idiotToken);
      member.guild.channels.find("name", settings.welcomeChannel).send({ files: [{ attachment: Buffer.from(body.data), name: "welcome.jpg" }] }).catch(console.error);
    }
  }
};
