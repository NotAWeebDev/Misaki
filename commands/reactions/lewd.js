const Social = require("../../structures/Social.js");

class Lewd extends Social {
  constructor(...args) {
    super(...args, {
      name: "lewd",
      description: "Someone or something needs a lewd.",
      usage: "lewd [@mention]",
      category: "Reactions",
      cost: 5,
      loadingString: "<a:typing:397490442469376001> **{{displayName}}** think about something lewd..."
    });
  }

  async run(message, args, level, loadingMessage) {
    const target = message.mentions.members;
    let response = "this";
    if (target.size !== 0) response = `**${target.first().displayName}**`;
    const lewd = await this.cmdWeeb("lewd", "gif", message.channel.nsfw);
    await loadingMessage.edit({
      embed: {
        "title": "Click here if the image failed to load.",
        "url": lewd,
        "description": `**${message.member.displayName}** thinks ${response} is a bit lewd.`,
        "color": message.guild ? message.guild.me.roles.highest.color : 5198940,
        "image": {
          "url": lewd
        }
      }
    });

  }
}

module.exports = Lewd;
