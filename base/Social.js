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
    const getPayee = message.guild.member(payee);
    const getPayer = message.guild.member(payer);
    const payerScore = getPayer.score;

    if (payerScore.points < parseInt(amount)) {
      message.response(undefined, `Insufficient funds, you have ₲${payerScore.points}`);
      return;
    }
    const filter = m => m.author.id === message.author.id;
    const response = await message.client.awaitReply(message, `Are you sure you want to pay ${getPayee.displayName} ₲${parseInt(amount)}?\n\n(**y**es | **n**o)\n\nReply with \`cancel\` to cancel the message. The message will timeout after 60 seconds.`, filter, 6000, null);

    if (["yes", "y", "confirm"].includes(response.toLowerCase())) {
      getPayer.takePoints(parseInt(amount));
      getPayee.givePoints(parseInt(amount));
      await message.channel.send(`The payment of ₲${parseInt(amount)} has been sent to ${getPayee.displayName}.`);
    } else
    
    if (["no", "n", "cancel"].includes(response.toLowerCase())) {
      message.channel.send("Payment cancelled");
    } else {
      message.channel.send("Invalid response, please try again.");
    }
  }

  async cmdPay(message, user, cost, options = {}) {
    const [bot, _user] = await this.verifySocialUser(message, user, options); // eslint-disable-line no-unused-vars
    const getPayee = message.guild.member(_user.id);
    const score = getPayee.score;
    if (cost > score.points) throw new SocialError(`Insufficient funds, you need ₲${cost}. Your current balance: ₲${score.points}`, options.msg);
    getPayee.takePoints(cost);
    this.client.points.set(getPayee.fullId, score);
  }

  async cmdRew(message, user, amount) {
    const getPayee = message.guild.member(user);
    getPayee.givePoints(parseInt(amount));
    await message.channel.send(`Awarded ₲${parseInt(amount)} to ${message.guild.member(user).displayName}.`);
    return;
  }

  async cmdPun(message, user, amount) {
    const getPayee = message.guild.member(user);
    getPayee.takePoints(parseInt(amount));
    await message.channel.send(`Deducted ₲${parseInt(amount)} from ${message.guild.member(user).displayName}.`);
    return;
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
