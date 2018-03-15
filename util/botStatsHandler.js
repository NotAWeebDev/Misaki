const { post } = require("snekfetch");

module.exports = class BotListHandler {
  constructor(client) {
    this.client = client;
    this.interval = this.client.setInterval(this.updateStats.bind(this), 9e5);
  }

  async updateStats() {
    try {
      await post(`https://discordbots.org/api/bots/${this.client.user.id}/stats`)
        .set("Authorization", this.client.tokens.DBLTOKEN)
        .send({server_count: this.client.guilds.size});
      await post(`https://bots.discord.pw/api/bots/${this.client.user.id}/stats`)
        .set("Authorization", this.client.tokens.DPWTOKEN)
        .send({server_count: this.client.guilds.size }); 
    } catch (error) {
      this.client.console.error(error);
    }
  }
};
