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

    this.client.user.setActivity(`@${this.client.user.username} help | ${this.client.guilds.size} Servers`);
    this.client.logger.log(`New guild has been joined: ${guild.name} (${guild.id}) with ${guild.memberCount - 1} members`);
  }
};
