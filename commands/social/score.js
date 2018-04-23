const Social = require("../../structures/Social.js");

class Score extends Social {
  constructor(...args) {
    super(...args, {
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
    if (member !== message.member) return this.resp("other", member, message);
    this.resp("self", member, message);
  }


  async resp(type, member, message) {
    const score = member.score;
    if (type === "other") message.channel.send(this.client.responses.otherBalanceMessages.random().replaceAll("{{user}}", member.displayName).replaceAll("{{amount}}", `₲${score.points.toLocaleString()}`));
    else
      message.channel.send(this.client.responses.balanceMessages.random().replaceAll("{{user}}", message.member.displayName).replaceAll("{{amount}}", `₲${score.points.toLocaleString()}`));
  }
}
module.exports = Score;