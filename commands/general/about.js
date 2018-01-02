const Command = require(`${process.cwd()}/base/Command.js`);
class About extends Command {
  constructor(client) {
    super(client, {
      name: "about",
      description: "What the bot is about.",
      usage: "about",
      category: "General"
    });
  }

  async run(message, args, level) { // eslint-disable-line no-unused-vars
    try {
      message.channel.send(this.client.responses.aboutMessages.random());
    } catch (e) {
      console.log(e);
    }
  }
}

module.exports = About;
