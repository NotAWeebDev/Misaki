const Command = require(`${process.cwd()}/base/Command.js`);
class Ping extends Command {
  constructor(client) {
    super(client, {
      name: "ping",
      description: "Latency and API response times.",
      usage: "ping",
      aliases: ["pong"]
    });
  }

  async run(message, args, level) { // eslint-disable-line no-unused-vars
    try {
      const msg = await message.channel.send(`**${message.member.displayName}-kun**...`);
      msg.edit(`${this.client.responses.pingMessages.random().replaceAll("{{user}}", message.member.displayName).replaceAll("{{ms}}", `${msg.createdTimestamp - message.createdTimestamp}`)}`);
    } catch (e) {
      console.log(e);
    }
  }
}

module.exports = Ping;
