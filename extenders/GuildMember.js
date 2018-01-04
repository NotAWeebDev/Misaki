const { Structures } = require("discord.js");

module.exports = Structures.extend("GuildMember", DiscordGuildMember => {
  return class GuildMember extends DiscordGuildMember {

    constructor(...args) {
      super(...args);
      this.fullId = `${this.guild.id}-${this.id}`;
    }

    get reminders() {
      const reminderList = this.client.reminders.findAll("id", this.id);
      if (!reminderList) return false;
      return reminderList;
    }

    get score() {
      if (!this.client.points.get(this.fullId)) return { points: 0, level: 0, user: this.id, guild: this.guild.id, daily: 1504120109 };
      return this.client.points.get(this.fullId);
    }

    givePoints(points) {
      const score = this.score;
      score.points += points;
      return this.client.points.set(this.fullId, score);
    }

    takePoints(points) {
      const score = this.score;
      score.points -= points;
      return this.client.points.set(this.fullId, score);
    }

    setLevel(level) {
      const score = this.score;
      score.level = level;
      return this.client.points.set(this.fullId, score);
    }

  };
});
