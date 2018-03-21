const Social = require("../../structures/Social.js");

class Daily extends Social {
  constructor(...args) {
    super(...args, {
      name: "daily",
      description: "Claim your daily points.",
      usage: "daily",
      category: "Social",
      extended: "This command will redeem your guilds daily bonus.",
      cost: 0,
      aliases: ["claim"]
    });
  }

  async run(message, args, level) { // eslint-disable-line no-unused-vars
    if (message.settings.socialSystem !== "true") return message.response(undefined, "The social system is disabled.");
    return await this.usrDay(message);
  }
}

module.exports = Daily;