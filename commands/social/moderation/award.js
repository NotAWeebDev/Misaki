const Social = require(`${process.cwd()}/base/Social.js`);

class Award extends Social {
  constructor(client) {
    super(client, {
      name: "award",
      description: "Gives a nominated user points.",
      usage: "award <@mention|userid> <amount>",
      category: "Social",
      extended: "This will give points to a nominated user.",
      cost: 0,
      hidden: true,
      aliases: ["reward", "give"],
      permLevel: "Administrator"
    });
  }

  async run(message, args, level) { // eslint-disable-line no-unused-vars
    if (message.settings.socialSystem !== "true") return message.response(undefined, "The social system is disabled.");

    if (args.length === 0) return message.response(undefined, "BAKA! You need to mention someone to reward them!");
    try {
      const [bot, user] = await this.verifySocialUser(message, args[0]);
      if (bot) return message.response("❗", "Bot's cannot accumulate points or levels.");
      if (isNaN(args[1])) return message.response(undefined, "Not a valid amount");
      if (args[1] < 0) return message.response(undefined, "You cannot pay less than zero, whatcha trying to do? rob em?");
      else if (args[1] < 1) return message.response(undefined, "You paying 'em with air? boi don't make me slap you 👋");
      if (message.author.id === user.id) return message.response(undefined, "You cannot reward yourself, why did you even try it?");
      await this.cmdRew(message, user, parseInt(args[1]));
    } catch (error) {
      this.client.logger.error(error.stack);
    }
  }
}

module.exports = Award;