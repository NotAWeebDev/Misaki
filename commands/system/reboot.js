const Command = require("../../structures/Command.js");

class Reboot extends Command {
  constructor(...args) {
    super(...args, {
      name: "reboot",
      description: "If running under PM2, bot will restart.",
      category: "System",
      usage: "reboot",
      permLevel: "Bot Admin"
    });
  }

  async run(message) {
    await message.channel.send("Rebooting...").catch(err => this.client.console.error(err));
    process.exit(1);
  }
}

module.exports = Reboot;