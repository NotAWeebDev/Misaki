const { post } = require("snekfetch");

module.exports = class BotListHandler {
  constructor(client) {
    this.client = client;
    this.interval = this.client.setInterval(this.updateStats.bind(this), 9e5); // 9e5 is 900,000 ms or 15 minutes
  }

  async updateStats() {
    if (this.client.user.id === "396323622953680910") {
      try {
        const totalUsers = this.client.users.size;
        const totalShards = this.client.ws.shards.length;
        const totalGuilds = this.client.guilds.size;
        await post(`https://discordbotlist.com/api/bots/${this.client.user.id}/stats`)
          .set("Authorization", `Bot ${process.env.DBLCOM}`)
          .send({ guilds: totalGuilds, users: totalUsers });
  
        await post(`https://botsfordiscord.com/api/bot/${this.client.user.id}`)
          .set("Authorization", process.env.BFDCOM)
          .send({ server_count: totalGuilds });
  
        await post(`https://discordbots.org/api/bots/${this.client.user.id}/stats`)
          .set("Authorization", process.env.DBLORG)
          .send({ server_count: totalGuilds, shard_count: totalShards });
    
        await post(`https://bots.discord.pw/api/bots/${this.client.user.id}/stats`)
          .set("Authorization", process.env.DISCPW)
          .send({ server_count: totalGuilds, shard_count: totalShards });
        
        this.client.dogstats.gauge("misaki.totalUsers", totalUsers);
        this.client.dogstats.gauge("misaki.totalGuilds", totalGuilds);
        this.client.dogstats.gauge("misaki.totalShards", totalShards);
        this.client.console.log("\u001b[43;30m[Submitted Stats.]");
      } catch (error) {
        this.client.console.log(error);
      }
    }
  }
};
