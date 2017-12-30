module.exports = class {
  constructor(client) {
    this.client = client;
  }

  async run(member) {
    const guild = member.guild;
    if (!member || !member.id || !guild) return;
    
    if (!member.user.bot) this.client.points.set(`${guild.id}-${member.id}`, { points: 0, level:0, user: member.id, guild: guild.id, daily: 1504120109 });

    const settings = this.client.getSettings(guild.id);
    
    if (settings.welcomeEnabled !== "true") return;

    member.guild.channels.find("name", settings.welcomeChannel).send(`${this.client.emojis.get("396391329367588878")}  ${this.client.responses.welcomeMessages.random().replaceAll("{{user}}", member.user.username).trim()}`).catch(console.error);
  }
};
