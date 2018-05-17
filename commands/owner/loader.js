const Store = require("../../structures/Store");
const Command = require("../../structures/Command.js");

class Loader extends Command {
  constructor(...args) {
    super(...args, {
      name: "load",
      description: "Loads a all commands or events.",
      usage: "load <store>",
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
