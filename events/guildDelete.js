const snekfetch = require("snekfetch");
module.exports = class {
  constructor(client) {
    this.client = client;
  }

  async run(guild) {

    snekfetch.post(`https://discordbots.org/api/bots/${this.client.user.id}/stats`)
      .set("Authorization", this.client.config.apiTokens.dblToken)
      .send({ server_count: this.client.guilds.size })
      .then(() => console.log("Sent guild count to discordbots.org!"));


    this.client.user.setActivity(`@${this.client.user.username} help | ${this.client.guilds.size} Server${this.client.guilds.size > 1 ? "s" : ""}`);
    this.client.settings.delete(guild.id);
    this.client.reminders.findAll("guildid", guild.id).forEach((i) => {
      if (guild.id === i.guildid) this.client.reminders.delete(`${i.id}-${i.reminderTimestamp}`);
    });
    this.client.logger.log(`A guild has been left: ${guild.name} (${guild.id}) with ${guild.memberCount - 1} members`);
  }
};
