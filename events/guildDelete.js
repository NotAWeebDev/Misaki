module.exports = class {
  constructor(client) {
    this.client = client;
  }

  async run(guild) {
    this.client.user.setActivity(`@${this.client.user.username} help | ${this.client.guilds.size} Server${this.client.guilds.size > 1 ? "s" : ""}`);
    this.client.settings.delete(guild.id);
    this.client.logger.log(`A guild has been left: ${guild.name} (${guild.id}) with ${guild.memberCount - 1} members`);
  }
};
