const { Structures } = require("discord.js");

module.exports = Structures.extend("GuildMember", GuildMember => class extends GuildMember {

  get fullId() {
    return `${this.guild.id}-${this.id}`;
  }

  get reminders() {
    return this.client.reminders.findAll("id", this.id) || null;
  }

  async score() {
    return await this.client.getPoints(this.fullId) || { points: 0, level: 0, user: this.id, guild: this.guild.id, daily: Date.now() - 86400000 };
  }

  get inventory() {
    return this.client.inventory.get(this.fullId) || { keys: 0, crates: 0, tokens: 0 };
  }

  giveItem(item, amount) {
    this.inventory[item] += amount;
    return this.client.inventory.set(this.fullId, this.inventory);
  }

  takeItem(item, amount) {
    this.inventory[item] -= amount;
    return this.client.inventory.set(this.fullId, this.inventory);
  }

  async givePoints(points) {
    this.score.points += points;
    return await this.client.writePoints(this.fullId, this.score);
  }

  takePoints(points) {
    this.score.points -= points;
    return this.client.points.set(this.fullId, this.score);
  }

  setLevel(level) {
    this.score.level = level;
    return this.client.points.set(this.fullId, this.score);
  }

});
