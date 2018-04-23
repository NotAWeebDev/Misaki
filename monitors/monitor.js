function giveRandomPoints(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}

module.exports = class {

  static run(client, message, level) {
    this.givePoints(client, message, level);
  }

  static givePoints(client, message) {
    if (!message.guild || !message.member) return;
    if (message.content.startsWith(message.settings.prefix)) return;
    const points = giveRandomPoints(parseInt(message.settings.minPoints), parseInt(message.settings.maxPoints));
    message.member.givePoints(points);
    const curLevel = Math.floor(0.1 * Math.sqrt(message.member.score.points));
    if (message.member.score.level < curLevel) {
      if (message.settings.levelNotice === "true") {
        message.channel.send(client.responses.levelUpMessages.random().replaceAll("{{user}}", message.member.displayName).replaceAll("{{level}}", curLevel).trim());
      }
      message.member.setLevel(curLevel);
    }
  }
};