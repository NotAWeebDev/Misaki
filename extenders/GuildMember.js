const { Structures } = require("discord.js");

module.exports = Structures.extend("GuildMember", GuildMember => {
  return class extends GuildMember {

    constructor(...args) {
      super(...args);
      this.fullId = `${this.guild.id}-${this.id}`;
    }

    get reminders() {
      return this.client.reminders.findAll("id", this.id) || null;
    }

    get score() {
      return this.client.points.get(this.fullId) || { points: 0, level: 0, user: this.id, guild: this.guild.id, daily: Date.now() - 86400000 };
    }

    get inventory() {
      return this.client.inventory.get(this.fullId) || { keys: 0, crates: 0, tokens: 0 };
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
