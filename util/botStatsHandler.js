const { post } = require("snekfetch");

module.exports = class BotListHandler {
  constructor(client) {
    this.client = client;
    this.interval = this.client.setInterval(this.updateStats.bind(this), 9e5); // 9e5 is 900,000 ms or 15 minutes
  }

  async updateStats() {
    if (this.client.user.id === "396323622953680910") {
      try {
        await post(`https://discordbotlist.com/api/bots/${this.client.user.id}/stats`)
          .set("Authorization", `Bot ${process.env.DBLCOM}`)
          .send({ guilds: this.client.guilds.size, users: this.client.users.size });
  
        // await post(`https://botsfordiscord.com/api/v1/bots/${this.client.user.id}`)
        //   .set("Authorization", process.env.BFDCOM)
        //   .send({ server_count: this.client.guilds.size });
  
        await post(`https://discordbots.org/api/bots/${this.client.user.id}/stats`)
          .set("Authorization", process.env.DBLORG)
          .send({ server_count: this.client.guilds.size, shard_count: this.client.ws.shards.length });
    
        await post(`https://bots.discord.pw/api/bots/${this.client.user.id}/stats`)
          .set("Authorization", process.env.DISCPW)
          .send({ server_count: this.client.guilds.size, shard_count: this.client.ws.shards.length });
        
        this.client.console.log("\u001b[43;30m[Submitted Stats to bot lists.]");
      } catch (error) {
        this.client.console.log(error);
      }
    }
  }
};
