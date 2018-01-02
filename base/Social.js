const Command = require(`${process.cwd()}/base/Command.js`);
const moment = require("moment");
class Social extends Command {

  constructor(client, options) {
    super(client, Object.assign(options, {
      guildOnly: true
    }));


  } 

  async verifySocialUser(message, user) {
    try {
      const check = await this.verifyUser(message, user);
      return [check.bot ? true : false, check];
    } catch (error) {
      console.log(error);
      // this.client.logger.error(error);
    }
  }


  emoji(guild) {
    const settings = this.client.getSettings(guild);
    if (settings.customEmoji === "true") return this.client.emojis.get(settings.gEmojiID);
    return settings.uEmoji;
  }

  ding(guild, score) {
    const curLevel = Math.floor(0.1 * Math.sqrt(score.points));
    if (score.level < curLevel) {
      return curLevel;
    } else

    if (score.level > curLevel) {
      return curLevel;
    }
    return score.level;
  }

  async usrDay(message, payer, payee) {
    const id = await this.verifySocialUser(message, payee);
    const settings = this.client.getSettings(message.guild.id);
    const dailyTime = parseInt(settings.dailyTime);
    const pointsReward = parseInt(settings.pointsReward);

    try {
      
      const getPayee = message.guild.member(id);
      const getPayer = message.guild.member(payer);
      const payerScore = getPayer.score;

      if (Date.now() > getPayer.score.daily) {

        const msg = await message.channel.send(`You have ${payer === payee ? "claimed" : "donated"} your daily ${pointsReward} ${this.emoji(message.guild.id)} points, Ain't that dandy?`);
        payerScore.daily = msg.createdTimestamp + (dailyTime * 60 * 60 * 1000);
        payer === payee ? getPayer.givePoints(pointsReward) : getPayee.givePoints(pointsReward);
        return msg;

      } else {
        const fromNow = moment(payerScore.daily).fromNow(true);
        message.channel.send(`You cannot claim your daily reward yet, please try again in ${fromNow}.`);
      }

    } catch (error) {
      this.client.logger.error(error);
    }
  }

  async usrPay(message, payer, payee, amount) {
    const getPayee = message.guild.member(payee);
    const getPayer = message.guild.member(payer);
    const payerScore = getPayer.score;

    try {
      if (payerScore.points < parseInt(amount)) {
        message.response(undefined, `Insufficient funds, you have ${payerScore.points} ${this.emoji(message.guild.id)}`);
        return;
      }
      const response = await message.client.awaitReply(message, `Are you sure you want to pay ${getPayee.displayName} ${parseInt(amount)} ${this.emoji(message.guild.id)}?\n\n(**y**es | **n**o)\n\nReply with \`cancel\` to cancel the message. The message will timeout after 60 seconds.`, 6000, null);

      if (["yes", "y", "confirm"].includes(response.toLowerCase())) {
        getPayer.takePoints(parseInt(amount));
        getPayee.givePoints(parseInt(amount));
        await message.channel.send(`The payment of ${parseInt(amount)} ${this.emoji(message.guild.id)} has been sent to ${getPayee.displayName}.`);
      } else
    
      if (["no", "n", "cancel"].includes(response.toLowerCase())) {
        message.channel.send("Payment cancelled");
      } else {
        message.channel.send("Invalid response, please try again.");
      }
    
    } catch (error) {
      // console.log(error.stack);
      this.client.logger.error(error);
    }

  }

  cmdDis(cost, level) {
    if (level >= 2) {
      cost = cost * 2 / 4;
    } else if (level === 1) {
      cost = cost * 2 / 3;
    }
    return Math.ceil(cost);
  }

  async cmdPay(message, user, cost, perms) {
    const amount = parseInt(cost) * parseInt(perms.length) * Math.floor(parseInt(message.settings.costMulti));
    try {
      const [bot, _user] = await this.verifySocialUser(message, user); // eslint-disable-line no-unused-vars
      const getPayee = message.guild.member(_user.id);
      const score = getPayee.score;
      if (amount > score.points) {
        message.response(undefined, `Insufficient funds, you need ${amount}${this.emoji(message.guild.id)}. Your current balance: ${score.points}${this.emoji(message.guild.id)}`);
        return false;
      }
      getPayee.takePoints(amount);
      this.client.points.set(getPayee.fullId, score);
      return true;
    } catch (error) {
      this.client.logger.error(error);
    }
  }

  async cmdRew(message, user, amount) {
    try {
      const getPayee = message.guild.member(user);
      getPayee.givePoints(parseInt(amount));
      await message.channel.send(`Awarded ${this.emoji(message.guild.id)}${parseInt(amount)} points to ${message.guild.member(user).displayName}.`);
      return;
    } catch (error) {
      this.client.logger.error(error);
    }
  }

  async cmdPun(message, user, amount) {
    try {
      const getPayee = message.guild.member(user);
      getPayee.takePoints(parseInt(amount));
      await message.channel.send(`Deducted ${this.emoji(message.guild.id)}${parseInt(amount)} points from ${message.guild.member(user).displayName}.`);
      return;
    } catch (error) {
      this.client.logger.error(error);
    }
  }

}

module.exports = Social;
