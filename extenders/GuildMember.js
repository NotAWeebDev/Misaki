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

  givePoints(points) {
    this.score.points = Number(this.score.points) + Number(points);
    return this.client.points.set(this.fullId, this.score);
  }

  takePoints(points) {
    this.score.points = Number(this.score.points) - Number(points);
    return this.client.points.set(this.fullId, this.score);
  }

  setLevel(level) {
    this.score.level = Number(level);
    return this.client.points.set(this.fullId, this.score);
  }

});
