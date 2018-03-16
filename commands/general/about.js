const Command = require(`${process.cwd()}/base/Command.js`);
class About extends Command {
  constructor(...args) {
    super(...args, {
      name: "about",
      description: "What the bot is about.",
      usage: "about",
      category: "General"
    });
  }

  async run(message, args, level) { // eslint-disable-line no-unused-vars
    message.channel.send(this.client.responses.aboutMessages.random());
  }
}

module.exports = About;
