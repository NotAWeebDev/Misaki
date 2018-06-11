const { Structures } = require("discord.js");

module.exports = Structures.extend("GuildMember", GuildMember => class extends GuildMember {

  get fullId() {
    return `${this.guild.id}-${this.id}`;
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
    Number(this.inventory[item]) += Number(amount);
    return this.client.inventory.set(this.fullId, this.inventory);
  }

  takeItem(item, amount) {
     Number(this.inventory[item]) -= Number(amount);
    return this.client.inventory.set(this.fullId, this.inventory);
  }

  givePoints(points) {
     Number(this.score.points) += Number(points);
    return this.client.points.set(this.fullId, this.score);
  }

  takePoints(points) {
     Number(this.score.points) -= Number(points);
    return this.client.points.set(this.fullId, this.score);
  }

  setLevel(level) {
     Number(this.score.level) = Number(level);
    return this.client.points.set(this.fullId, this.score);
  }

});
