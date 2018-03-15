const Event = require(`${process.cwd()}/base/Event.js`);

module.exports = class extends Event {

  async run(guild) {
    this.client.user.setActivity(`@${this.client.user.username} help | ${this.client.guilds.size} Servers`);
    this.client.logger.log(`New guild has been joined: ${guild.name} (${guild.id}) with ${guild.memberCount - 1} members`);
  }
};
