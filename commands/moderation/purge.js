const Command = require(`${process.cwd()}/base/Command.js`);

class Purge extends Command {
  constructor(client) {
    super(client, {
      name: "purge",
      description: "Allows you to purge a users or channels messages.",
      usage: "purge <num> <user>",
      category: "System",
      guildOnly: true,
      aliases: ["clean", "remove", "delete"],
      permLevel: "Moderator"
    });
  }

  async run(message, args, level) { // eslint-disable-line no-unused-vars
    if (args[0].isNumber() == true && args[1] == null) {
      if (args[0] < 2 || args[0] > 100) return message.channel.send("Unable to purge messages, invalid integer for purge amount. Value must be between 2 and 100 messages.").then((msg) => msg.delete(5000));
      const todelete = await message.channel.messages.fetch({limit: args[0]});
      await message.channel.bulkDelete(todelete).catch(error => console.log(error.stack));
      const reply = await this.client.responses.purgeMessages.random().replaceAll("{{amount}}", todelete.size);
      await message.channel.send(reply).then((msg) => msg.delete(5000));
    }
  }
}

module.exports = Purge;