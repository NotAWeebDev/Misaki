const Social = require(`${process.cwd()}/base/Social.js`);

class Score extends Social {
  constructor(client) {
    super(client, {
      name: "score",
      description: "Displays your current level and points.",
      usage: "score",
      category: "Social",
      cost: 0,
      aliases: ["points", "level", "bal", "balance"],
      botPerms: ["SEND_MESSAGES"]
    });
  }

  async run(message, args, level) { // eslint-disable-line no-unused-vars
    const member = args[0] ? await this.verifyMember(message, args[0]) : message.member;
    const score = member.score;
    message.channel.send(`${this.client.responses.balanceMessages.random().replaceAll("{{user}}", message.member.displayName).replaceAll("{{amount}}", `${this.emoji(message.guild.id)}${score.points.toLocaleString()}`)}`);
  }
}

module.exports = Score;