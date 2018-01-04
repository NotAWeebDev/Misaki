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
    if (member != message.member) return resp("other", member, message, this.client, this);
    resp("self", member, message, this.client, this);
  }
}
async function resp(type, member, message, client, social) {
  const score = member.score;
  if (type === "other") message.channel.send(`${client.responses.otherBalanceMessages.random().replaceAll("{{user}}", member.displayName).replaceAll("{{amount}}", `${social.emoji(message.guild.id)}${score.points.toLocaleString()}`)}`);
  else
    message.channel.send(`${client.responses.balanceMessages.random().replaceAll("{{user}}", message.member.displayName).replaceAll("{{amount}}", `${social.emoji(message.guild.id)}${score.points.toLocaleString()}`)}`);
}
module.exports = Score;