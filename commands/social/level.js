const Social = require("../../structures/Social.js");

class Level extends Social {
  constructor(...args) {
    super(...args, {
      name: "level",
      description: "Displays your current level.",
      usage: "level",
      category: "Social",
      cost: 0,
      aliases: ["rank"]
    });
  }

  async run(message, args, level) { // eslint-disable-line no-unused-vars
    if (message.settings.socialSystem !== "true") return message.response(undefined, "The social system is disabled.");
    
    const member = args[0] ? await this.verifyMember(message, args[0]) : message.member;
    if (member != message.member) return this.resp("other", member, message, this.client, this);
    this.resp("self", member, message, this.client);
  }


  async resp(type, member, message, client) {
    const level = member.score.level;
    if (type === "other") message.channel.send(`${client.responses.otherLevelMessages.random().replaceAll("{{user}}", member.displayName).replaceAll("{{level}}", level)}`);
    else
      message.channel.send(`${client.responses.levelMessages.random().replaceAll("{{user}}", message.member.displayName).replaceAll("{{level}}", level)}`);
  }
}
module.exports = Level;