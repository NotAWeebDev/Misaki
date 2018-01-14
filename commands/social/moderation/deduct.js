const Social = require(`${process.cwd()}/base/Social.js`);

class Deduct extends Social {
  constructor(client) {
    super(client, {
      name: "deduct",
      description: "Takes points away from the nominated user.",
      usage: "deduct <@mention|userid> <amount>",
      category: "Moderation",
      extended: "This will take points away from a nominated user.",
      cost: 5,
      hidden: true,
      aliases: ["punish", "take"],
      permLevel: "Administrator"
    });
  }

  async run(message, args, level) { // eslint-disable-line no-unused-vars
    if (message.settings.socialSystem !== "true") return message.response(undefined, "The social system is disabled.");

    if (args.length === 0) return message.response(undefined, "BAKA! You need to mention someone to punish them!");
    try {
      const [bot, user] = await this.verifySocialUser(message, args[0]);
      if (bot) return message.response("❗", "Bot's cannot accumulate points or levels.");
      if (isNaN(args[1])) return message.response(undefined, "Not a valid amount");
      if (parseInt(args[1]) > parseInt(message.guild.members.get(user.id).score.points)) return message.response(undefined, "You cannot deduct less than their points, whatcha trying to do? reward em?");
      else if (args[1] < 1) return message.response(undefined, "You trying to deduct their air? boi don't make me slap you 👋");
      if (message.author.id === user.id) return message.response(undefined, "You cannot punish yourself, why did you even try it?");
      await this.cmdPun(message, user, parseInt(args[1]));
    } catch (error) {
      throw error;
    }
  }
}

module.exports = Deduct;