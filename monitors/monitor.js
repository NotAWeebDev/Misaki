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
    const score = message.member.score;
    const points = giveRandomPoints(parseInt(settings.minPoints), parseInt(settings.maxPoints));
    console.log(`Awarded ${points} to ${message.author.username}`);
    message.member.givePoints(points);
    const curLevel = Math.floor(0.1 * Math.sqrt(score.points));
    if (score.level < curLevel) {
      if (settings.levelNotice === "true") {
        message.channel.send(`${client.responses.levelUpMessages.random().replaceAll("{{user}}", message.member).replaceAll("{{level}}", curLevel).trim()}`);
      }
      message.member.setLevel(curLevel);
    }

  }
};