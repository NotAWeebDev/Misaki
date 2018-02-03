const Social = require(`${process.cwd()}/base/Social.js`);

class Score extends Social {
  constructor(client) {
    super(client, {
      name: "score",
      description: "Displays your current points.",
      usage: "score",
      category: "Social",
      cost: 0,
      aliases: ["points", "bal", "balance"]
    });
  }

  async run(message, args, level) { // eslint-disable-line no-unused-vars
    if (message.settings.socialSystem !== "true") return message.response(undefined, "The social system is disabled.");
    
    const member = args[0] ? await this.verifyMember(message, args[0]) : message.member;
    if (member != message.member) return this.resp("other", member, message, this.client, this);
    this.resp("self", member, message, this.client);
  }


  async resp(type, member, message, client) {
    const score = member.score;
    if (type === "other") message.channel.send(`${client.responses.otherBalanceMessages.random().replaceAll("{{user}}", member.displayName).replaceAll("{{amount}}", `₲${score.points.toLocaleString()}`)}`);
    else
      message.channel.send(`${client.responses.balanceMessages.random().replaceAll("{{user}}", message.member.displayName).replaceAll("{{amount}}", `₲${score.points.toLocaleString()}`)}`);
  }
}
module.exports = Score;