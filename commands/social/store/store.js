const Social = require(`${process.cwd()}/base/Social.js`);

class Store extends Social {
  constructor(client) {
    super(client, {
      name: "store",
      description: "Display All Store Items",
      usage: "store",
      category: "Social",
      aliases: []
    });
  }

  async run(message, args, level) { // eslint-disable-line no-unused-vars
    try {

      const items = message.guild.store;
      if (items.length === 0) return message.response(undefined, "Baka... nothing is for sale!");
      message.channel.send(items.map(item => 
        `${message.guild.roles.get(item.id.toString()).name}: ${item.price} 💰`).join("\n"), { code: true }
      );
    } catch (e) {
      console.log(e);
    }
  }
}
module.exports = Store;
