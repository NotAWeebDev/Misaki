const Command = require(`${process.cwd()}/base/Command.js`);
class Inventory extends Command {
  constructor(client) {
    super(client, {
      name: "inventory",
      description: "Displays your inventory.",
      usage: "inventory",
      aliases: ["inv"]
    });
  }

  async run(message, args, level) { // eslint-disable-line no-unused-vars
    try {
      const inventory = message.member.inventory;
      console.log(inventory);
      if (!inventory) return message.response(undefined, "This feature isn't finished, please come back later... ~~_baka_~~");
      // message.channel.send(inventory.map(item => item));
    } catch (e) {
      console.log(e);
    }
  }
}

module.exports = Inventory;
