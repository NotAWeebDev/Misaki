const Social = require(`${process.cwd()}/base/Social.js`);

class Daily extends Social {
  constructor(client) {
    super(client, {
      name: "daily",
      description: "Claim your daily points.",
      usage: "daily",
      category: "Social",
      extended: "This command will redeem your guilds daily bonus.",
      cost: 0,
      aliases: ["claim"],
      botPerms: []
    });
  }

  async run(message, args, level) { // eslint-disable-line no-unused-vars
    try {
      await this.usrDay(message);
    } catch (error) {
      throw error;
    }
  }
}

module.exports = Daily;