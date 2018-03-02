const Owner = require(`${process.cwd()}/base/Owner.js`);
class Emit extends Owner {
  constructor(client) {
    super(client, {
      name: "emit",
      description: "Emit an event, debugging only...",
      usage: "emit"
    });
  }

  async run(message, args, level) { // eslint-disable-line no-unused-vars
    const member = (message.mentions.members.first() || message.member);

    await this.client.emit("guildMemberAdd", member);
    await this.client.emit("guildMemberRemove", member);
  }
}

module.exports = Emit;