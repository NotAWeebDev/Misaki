module.exports = class {
  constructor(client) {
    this.client = client;
  }

  async run(member) {
    const guild = member.guild;
    if (!member || !member.id || !guild) return;
    const settings = this.client.getSettings(guild.id);

    if (!member.user.bot) this.client.points.delete(`${guild.id}-${member.id}`);
    
    member.reminders.forEach((i) => {
      if (guild.id === i.guildid) member.reminders.delete(`${i.id}-${i.reminderTimestamp}`);
    });

    if (settings.welcomeEnabled !== "true") return;

    member.guild.channels.find("name", settings.welcomeChannel).send(`${this.client.emojis.get("396395362748858368")}  ${this.client.responses.goodbyeMessages.random().replaceAll("{{user}}", member.user.username).trim()}`).catch(console.error);
  }
};
