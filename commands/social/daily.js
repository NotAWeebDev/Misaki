const Social = require(`${process.cwd()}/base/Social.js`);

class Daily extends Social {
  constructor(client) {
    super(client, {
      name: "daily",
      description: "Claim or give your daily points.",
      usage: "daily [user]",
      category: "Social",
      extended: "You can either claim or donate your daily points.",
      cost: 0,
      aliases: ["claim"],
      botPerms: []
    });
  }

  async run(message, args, level) { // eslint-disable-line no-unused-vars
    const payee = args.join(" ") || message.author.id;
    try {
      await this.usrDay(message, message.author.id, payee);
    } catch (error) {
      throw error;
    }
  }
}

module.exports = Daily;