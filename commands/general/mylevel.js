const Command = require("../../structures/Command.js");

class MyLevel extends Command {
  constructor(...args) {
    super(...args, {
      name: "mylevel",
      description: "Displays your permission level for your location.",
      usage: "mylevel",
      cooldown: 10      
    });
  }

  async run(message, args, level) {
    const friendly = this.client.config.permLevels.find(l => l.level === level).name;
    message.channel.send(`${this.client.responses.myLevelMessages.random().replaceAll("{{user}}", message.member.displayName).replaceAll("{{level}}", level).replaceAll("{{friendly}}", friendly.toLowerCase())}.`);
  }
}

module.exports = MyLevel;
