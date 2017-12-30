const timeout = new Map();
function giveRandomPoints(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}

module.exports = class {

  static run(client, message, level) {
    this.givePoints(client, message, level);
  }

  static givePoints(client, message, level) { // eslint-disable-line no-unused-vars
    if (message.channel.type !== "text") return;
    const settings = message.settings;
    if (message.content.startsWith(settings.prefix)) return;
    const score = client.points.get(`${message.guild.id}-${message.author.id}`) || { points: 0, level: 0, user: message.author.id, guild: message.guild.id, daily: 1504120109 };
    const timedOut = timeout.get(`${message.guild.id}-${message.author.id}`);
    if (timedOut) return;
    timeout.set(`${message.guild.id}-${message.author.id}`, true);
    const points = giveRandomPoints(parseInt(settings.minPoints), parseInt(settings.maxPoints));
    setTimeout(() => {
      timeout.set(`${message.guild.id}-${message.author.id}`, false);
      score.points += points;
      console.log(`Awarded ${points} to ${message.author.username}`);
      const curLevel = Math.floor(0.1 * Math.sqrt(score.points));
      if (score.level < curLevel) {
        if (settings.levelNotice === "true")
          message.channel.send(`${this.client.responses.levelUpMessages.random().replaceAll("{{name}}", message.member).replaceAll("{{level}}", curLevel).trim()}`);
        score.level = curLevel;
      }
      client.points.set(`${message.guild.id}-${message.author.id}`, score);
    }, parseInt(settings.scoreTime) * 60 * 1000);

  }
};