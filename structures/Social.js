const Command = require("./Command.js");
const { version } = require("../package.json");
const moment = require("moment");
const { get } = require("snekfetch");

class Social extends Command {

  constructor(client, file, options = {}) {
    super(client, file, Object.assign(options, { guildOnly: true }));
    this.loadingString = options.loadingString;
  }

  async verifySocialUser(message, user, options = {}) {
    const check = await this.verifyUser(message, user, options);
    if (!check) return;
    return [!!check.bot, check];
  }

  async usrDay(message) {
    const dailyTime = parseInt(message.settings.dailyTime);
    let pointsReward = parseInt(message.settings.pointsReward);
    const upvoter = this.client.upvoters;
    if (upvoter.includes(message.author.id)) pointsReward += 750;
    if (Date.now() > message.member.score.daily) {
      const msg = await message.channel.send(`${this.client.responses.dailySuccessMessages.random().replaceAll("{{user}}", message.member.displayName).replaceAll("{{amount}}", `₲${pointsReward.toLocaleString()}`)}`);
      message.member.score.daily = msg.createdTimestamp + (dailyTime * 60 * 60 * 1000);
      message.member.givePoints(pointsReward);
      return msg;
    } else {
      const fromNow = moment(message.member.score.daily).fromNow(true);
      message.channel.send(`${this.client.responses.dailyFailureMessages.random().replaceAll("{{user}}", message.member.displayName).replaceAll("{{time}}", fromNow)}.`);
    }
  }

  async usrPay(message, payer, payee, amount) {
    amount = parseInt(amount);
    const getPayee = await message.guild.members.fetch(payee);
    const getPayer = await message.guild.members.fetch(payer);
    const payerScore = getPayer.score;

    if (payerScore.points < amount) return message.response(undefined, `Insufficient funds, you have ₲${payerScore.points}`);

    const filter = msg => msg.author.id === message.author.id;
    const response = await message.awaitReply([`Are you sure you want to pay ${getPayee.displayName} ₲${amount}?`,
      "",
      "(**y**es | **n**o)",
      "",
      "Reply with `cancel` to cancel the message. The message will timeout after 60 seconds."
    ].join("\n"), filter, 6000, null);

    if (["yes", "y", "confirm"].includes(response.toLowerCase())) {
      getPayer.takePoints(amount);
      getPayee.givePoints(amount);
      await message.channel.send(`The payment of ₲${amount} has been sent to ${getPayee.displayName}.`);
    } else if (["no", "n", "cancel"].includes(response.toLowerCase())) {
      message.channel.send("Payment cancelled");
    } else {
      message.channel.send("Invalid response, please try again.");
    }
  }

  async cmdPay(message, user, cost, options = {}) {
    const [, _user] = await this.verifySocialUser(message, user, options);
    const getPayee = message.guild.member(_user.id);
    if (cost > getPayee.score.points) throw new this.client.methods.errors.SocialError(`Insufficient funds, you need ₲${cost}. Your current balance: ₲${getPayee.score.points}`, options.msg);
    getPayee.takePoints(cost);
    this.client.points.set(getPayee.fullId, getPayee.score);
  }

  async cmdRew(message, user, amount) {
    const member = await message.guild.members.fetch(user);
    member.givePoints(amount);
    return message.channel.send(`Awarded ₲${amount} to ${member.displayName}.`);
  }

  async cmdPun(message, user, amount) {
    const member = await message.guild.members.fetch(user);
    member.takePoints(amount);
    return message.channel.send(`Deducted ₲${amount} from ${member.displayName}.`);
  }

  async cmdWeeb(type, imgType, nsfw = false) {
    const { body } = await get(`https://api.weeb.sh/images/random?type=${type}&filetype=${imgType}&nsfw=${nsfw}`)
      .set("Authorization", `Wolke ${process.env.WEEBSH}`)
      .set("User-Agent", `Misaki/${version}/${this.client.user.id === "396323622953680910" ? "Production" : "Development"}`);
    return body.url;
  }

  cmdVerify() {
    return Promise.resolve();
  }
}

module.exports = Social;
