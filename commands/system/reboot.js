const Command = require(`${process.cwd()}/base/Command.js`);

class Reboot extends Command {
  constructor(client) {
    super(client, {
      name: "reboot",
      description: "If running under PM2, bot will restart.",
      category: "System",
      usage: "reboot",
      permLevel: "Bot Admin"
    });
  }

  async run(message, args, level) { // eslint-disable-line no-unused-vars
    try {
      await message.channel.send(`${this.client.responses.rebootMessages.random().replaceAll("{{user}}", message.member.displayName)}`);
      this.client.commands.forEach(async cmd => {
        await this.client.unloadCommand(cmd);
      });
      process.exit(1);
    } catch (e) {
      console.log(e);
    }
  }
}

module.exports = Reboot;