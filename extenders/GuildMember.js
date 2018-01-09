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

    get inventory() {
      if (!this.client.inventory.get(this.fullId)) return { keys: 0, crates: 0, tokens: 0 };
      return this.client.inventory.get(this.fullId);
    }

    giveItem(item, amount) {
      const inv = this.inventory;
      inv[item] += parseInt(amount);
      return this.client.inventory.set(this.fullId, inv);
    }
    
    takeItem(item, amount) {
      const inv = this.inventory;
      inv[item] -= parseInt(amount);
      return this.client.inventory.set(this.fullId, inv);
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
