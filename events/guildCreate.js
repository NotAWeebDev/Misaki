const Event = require("../structures/Event.js");

module.exports = class extends Event {

  async run(guild) {
    if (!guild.available) return;
    this.client.dogstats.increment("misaki.guildcreate");
    this.client.user.setActivity(`@${this.client.user.username} help | ${this.client.guilds.size.toLocaleString()} Servers`);
    this.client.console.log(`New guild has been joined: ${guild.name} (${guild.id}) with ${guild.memberCount - 1} members`);
  }
};
