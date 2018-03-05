const Command = require(`${process.cwd()}/base/Command.js`);
const { version} = require(`${process.cwd()}/package.json`);
const moment = require("moment");
const { get } = require("snekfetch");
const { SocialError } = require("../util/CustomError.js");

class Social extends Command {

  constructor(client, options) {
    super(client, Object.assign(options, {
      guildOnly: true
    }));
    this.loadingString = options.loadingString;
  }

  async verifySocialUser(message, user, options = {}) {
    const check = await this.verifyUser(message, user, options);
    if (!check) return;
    return [check.bot ? true : false, check];
  }


  async usrDay(message) {
    const settings = this.client.getSettings(message.guild.id);
    const dailyTime = parseInt(settings.dailyTime);
    let pointsReward = parseInt(settings.pointsReward);
    const score = message.member.score;
    const upvoter = this.client.upvoters;
    if (upvoter.includes(message.author.id)) pointsReward += 750;
    if (Date.now() > score.daily) {
      const msg = await message.channel.send(`${this.client.responses.dailySuccessMessages.random().replaceAll("{{user}}", message.member.displayName).replaceAll("{{amount}}", `₲${pointsReward.toLocaleString()}`)}`);
      score.daily = msg.createdTimestamp + (dailyTime * 60 * 60 * 1000);
      message.member.givePoints(pointsReward);
      return msg;
    } else {
      const fromNow = moment(score.daily).fromNow(true);
      message.channel.send(`${this.client.responses.dailyFailureMessages.random().replaceAll("{{user}}", message.member.displayName).replaceAll("{{time}}", fromNow)}.`);
    }
  }

  async usrPay(message, payer, payee, amount) {
    amount = parseInt(amount);
    const getPayee = await message.guild.members.fetch(payee);
    const getPayer = await message.guild.members.fetch(payer);
    const payerScore = getPayer.score;

    if (payerScore.points < amount) return message.response(undefined, `Insufficient funds, you have ₲${payerScore.points}`);
    
    const filter = m => m.author.id === message.author.id;
    const response = await this.client.awaitReply(message, `Are you sure you want to pay ${getPayee.displayName} ₲${amount}?

(**y**es | **n**o)

Reply with \`cancel\` to cancel the message. The message will timeout after 60 seconds.`, filter, 6000, null);

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
    const score = getPayee.score;
    if (cost > score.points) throw new SocialError(`Insufficient funds, you need ₲${cost}. Your current balance: ₲${score.points}`, options.msg);
    getPayee.takePoints(cost);
    this.client.points.set(getPayee.fullId, score);
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
      .set("Authorization", this.client.config.apiTokens.Wolken)
      .set("User-Agent", `Misaki/${version}/${this.client.user.id === "396323622953680910" ? "Production" : "Development"}`);
    return body.url;
  }

  cmdVerify() {
    return Promise.resolve();
  }
}

module.exports = Social;
