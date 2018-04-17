const { Structures } = require("discord.js");

module.exports = Structures.extend("GuildMember", GuildMember => class extends GuildMember {

  get fullId() {
    return `${this.guild.id}-${this.id}`;
  }

  get score() {
    return this.client.getPoints(this.fullId, this.id, this.guild.id);
  }

  async givePoints(points) {
    const { dataValues } = this.client.points.findById(this.fullId);
    console.log(dataValues.points);
    dataValues.points += points;
    console.log(dataValues.points);
    return await this.client.writePoints(this.fullId, dataValues);
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
