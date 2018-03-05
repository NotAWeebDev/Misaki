const { post } = require("snekfetch");
const Event = require(`${process.cwd()}/base/Event.js`);

module.exports = class extends Event {

  async run(guild) {
    this.client.user.setActivity(`@${this.client.user.username} help | ${this.client.guilds.size} Servers`);
    this.client.logger.log(`New guild has been joined: ${guild.name} (${guild.id}) with ${guild.memberCount - 1} members`);

    if (!this.client.config.apiTokens.dblToken) return;
    post(`https://discordbots.org/api/bots/${this.client.user.id}/stats`)
      .set("Authorization", this.client.config.apiTokens.dblToken)
      .send({ server_count: this.client.guilds.size })
      .then(() => this.client.logger.log("Sent guild count to discordbots.org!"))
      .catch(() => this.client.logger.error("Error sending guild count to discordbots.org"));
  }
};
