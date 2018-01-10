const Owner = require(`${process.cwd()}/base/Owner.js`);
const {promisify} = require("util");
const write = promisify(require("fs").writeFile);

class Reboot extends Owner {
  constructor(client) {
    super(client, {
      name: "reboot",
      description: "If running under PM2, bot will restart.",
      category: "Owner",
      usage: "reboot",
      permLevel: "Bot Admin"
    });
  }

  async run(message, args, level) { // eslint-disable-line no-unused-vars
    try {
      const msg = await message.channel.send(`${this.client.responses.rebootMessages.random().replaceAll("{{user}}", message.member.displayName)}`);
      await write(`${process.cwd()}/assets/json/reboot.json`, `{ "id": "${msg.id}", "channel": "${message.channel.id}", "user": "${message.author.id}"}`).catch(console.error);
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