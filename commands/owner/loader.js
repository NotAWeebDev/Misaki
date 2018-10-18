const Store = require("../../structures/Store");
const Owner = require("../../structures/Owner.js");

class Loader extends Owner {
  constructor(...args) {
    super(...args, {
      name: "load",
      description: "Loads all commands or events.",
      usage: "load <store>",
      category: "Creator",
      aliases:["loader"]
    });
  }

  async run(message, [store]) {
    if (!store) return message.channel.send("Please provide a valid store");
    if (!(this.client[store] instanceof Store)) return message.channel.send("Please provide a valid store");
    try {
      const size = await this.client[store].loadFiles();
      return message.channel.send(`Successfully reloaded/loaded ${size} ${this.client[store].name}`);
    } catch (error) {
      return message.channel.send(`There has been an error loading all files, ${error.message}`);
    }
  }
}

module.exports = Loader;
