const Event = require("../structures/Event.js");

module.exports = class extends Event {

  async run(guild) {
    if (!guild.available) return;
    this.client.dogstats.increment("misaki.guilddelete");

    this.client.user.setActivity(`@${this.client.user.username} help | ${this.client.guilds.size.toLocaleString()} Server${this.client.guilds.size > 1 ? "s" : ""}`);

    if (this.client.settings.has(guild.id)) {
      this.client.settings.delete(guild.id);
    }
    
    this.client.reminders.findAll("guildid", guild.id).forEach(i => {
      if (guild.id === i.guildid) this.client.reminders.delete(`${i.id}-${i.reminderTimestamp}`);
    });
    
    this.client.console.log(`A guild has been left: ${guild.name} (${guild.id}) with ${guild.memberCount - 1} members`);
  }
};
