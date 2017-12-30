const Command = require("./Command.js");
const moment = require("moment");
class Social extends Command {

  constructor(client, options) {
    super(client, Object.assign(options, {
      category: "Social",
      guildOnly: true
    }));


  } 

  async verifySocialUser(user) {
    try {
      const match = /(?:<@!?)?([0-9]{17,20})>?/gi.exec(user);
      if (!match) throw "Invalid user id.";
      const id = match[1];
      const check = await this.client.fetchUser(id);
      if (check.bot) throw "Bot's cannot accumulate points or levels.";
      if (check.username !== undefined) return id;
    } catch (error) {
      throw error;
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
    await this.verifySocialUser(payee);
    const settings = this.client.settings.get(message.guild.id);
    const dailyTime = parseInt(settings.dailyTime);
    const pointsReward = parseInt(settings.pointsReward);

    try {
      // payee: The user getting paid
      const getPayee = this.client.points.get(`${message.guild.id}-${payee}`) ||
      this.client.points.set(`${message.guild.id}-${payee}`, { points: 0, level: 0, user: payee, guild: message.guild.id, daily: 1504120109 }).get(`${message.guild.id}-${payee}`);

      // payer: The user paying.
      const getPayer = this.client.points.get(`${message.guild.id}-${payer}`) ||
      this.client.points.set(`${message.guild.id}-${payer}`, { points: 0, level: 0, user: payer, guild: message.guild.id, daily: 1504120109 }).get(`${message.guild.id}-${payer}`);

      if (Date.now() > getPayer.daily) {
        if (payer === payee) {
          const msg = await message.channel.send(`You have claimed your daily ${pointsReward} ${this.emoji(message.guild.id)} points, Ain't that dandy?`);
          getPayer.daily = msg.createdTimestamp + (dailyTime * 60 * 60 * 1000);
          getPayer.points += pointsReward;
          this.client.points.set(`${message.guild.id}-${payer}`, getPayer);
          return msg;
        } else {
          const msg = await message.channel.send(`You have donated your daily ${pointsReward} ${this.emoji(message.guild.id)} points, Ain't that dandy?`);
          getPayer.daily = msg.createdTimestamp + (dailyTime * 60 * 60 * 1000);
          getPayee.points += pointsReward;
          this.client.points.set(`${message.guild.id}-${payee}`, getPayee);
          return msg;
        }
      } else {
        const fromNow = moment(getPayer.daily).fromNow(true);
        message.channel.send(`You cannot claim your daily reward yet, please try again in ${fromNow}.`);
      }
    } catch (error) {
      throw error;
    }
  }

  async usrPay(message, payer, payee, amount) {
    await this.verifySocialUser(payee);
    try {
      // payer: The user paying.
      const getPayer = this.client.points.get(`${message.guild.id}-${payer}`) ||
        this.client.points.set(`${message.guild.id}-${payer}`, {
          points: 0,
          level: 0,
          user: payer,
          guild: message.guild.id,
          daily: 1504120109
        }).get(`${message.guild.id}-${payer}`);

      // payee: The user getting paid
      const getPayee = this.client.points.get(`${message.guild.id}-${payee}`) ||
        this.client.points.set(`${message.guild.id}-${payee}`, {
          points: 0,
          level: 0,
          user: payee,
          guild: message.guild.id,
          daily: 1504120109
        }).get(`${message.guild.id}-${payee}`);

      if (getPayer.points < parseInt(amount)) {
        throw `Insufficient funds, you have ${getPayer.points}${this.emoji(message.guild.id)}`;
      }

      const response = await message.client.awaitReply(message, `Are you sure you want to pay ${message.guild.member(payee).displayName} ${parseInt(amount)} ${this.emoji(message.guild.id)}?\n\n(**y**es | **n**o)\n\nReply with \`cancel\` to cancel the message. The message will timeout after 60 seconds.`);

      if (["yes", "y", "confirm"].includes(response.toLowerCase())) {
        getPayer.points -= parseInt(amount);
        getPayee.points += parseInt(amount);
        await message.channel.send(`The payment of ${parseInt(amount)}${this.emoji(message.guild.id)} has been sent to ${message.guild.member(payee).displayName}.`);
        await this.client.points.set(`${message.guild.id}-${payer}`, getPayer);
        await this.client.points.set(`${message.guild.id}-${payee}`, getPayee);
      } else

      if (["no", "n", "cancel"].includes(response.toLowerCase())) {
        message.channel.send("Payment cancelled");
      } else {
        message.channel.send("Invalid response, please try again.");
      }
    } catch (error) {
      throw error;
    }

  }

  async usrBal(message, user) {
    const id = await this.verifySocialUser(user);
    const score = this.client.points.get(`${message.guild.id}-${id}`) || this.client.points.set(`${message.guild.id}-${id}`, {
      points: 0,
      level: 0,
      user: id,
      guild: message.guild.id,
      daily: 1504120109
    }).get(`${message.guild.id}-${id}`);
    const level = this.ding(message.guild.id, score);
    score.level = level;
    this.client.points.set(`${message.guild.id}-${id}`, score);
    const YouThey = id === message.author.id ? "You" : "They";
    const YouThem = YouThey.length > 3 ? "them" : "you";
    return score ? `${YouThey} currently have ${score.points} ${this.emoji(message.guild.id)}'s, which makes ${YouThem} level ${score.level}!` : `${YouThey} have no ${this.emoji(message.guild.id)}'s, or levels yet.`;
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
      const score = this.client.points.get(`${message.guild.id}-${user}`) || this.client.points.set(`${message.guild.id}-${user}`, { points: 0, level: 0, user: user, guild: message.guild.id, daily: 1504120109 }).get(`${message.guild.id}-${user}`);
      if (amount > score.points) throw `Insufficient funds, you need ${amount}${this.emoji(message.guild.id)}. Your current balance: ${score.points}${this.emoji(message.guild.id)}`;
      score.points -= amount;
      this.client.points.set(`${message.guild.id}-${user}`, score);
      return true;
    } catch (error) {
      throw error;
    }
  }

  async cmdRew(message, user, amount) {
    try {
      const score = this.client.points.get(`${message.guild.id}-${user}`);
      score.points += amount;
      this.client.points.set(`${message.guild.id}-${user}`, score);
      await message.channel.send(`Awarded ${parseInt(amount)}${this.emoji(message.guild.id)} points to ${message.guild.member(user).displayName}.`);
      return;
    } catch (error) {
      throw error;
    }
  }

  async cmdPun(message, user, amount) {
    try {
      const score = this.client.points.get(`${message.guild.id}-${user}`);
      score.points -= amount;
      this.client.points.set(`${message.guild.id}-${user}`, score);
      await message.channel.send(`Deducted ${parseInt(amount)}${this.emoji(message.guild.id)} points from ${message.guild.member(user).displayName}.`);
      return;
    } catch (error) {
      throw error;
    }
  }

}
module.exports = Social;
