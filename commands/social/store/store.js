const Social = require(`${process.cwd()}/base/Social.js`);

function titleCase(str) {
  return str.toLowerCase().split(" ").map(function(word) {
    return word.replace(word[0], word[0].toUpperCase());
  }).join(" ");
}

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
        `${titleCase(item.name)}: ${item.price} 💰`).join("\n"), { code: true }
      );
    } catch (e) {
      console.log(e);
    }
  }
}
module.exports = Store;
