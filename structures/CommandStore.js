const { Collection } = require("discord.js");

class CommandStore extends Collection {

  constructor(client) {
    super();

    Object.defineProperty(this, "client", { value: client });
    this.aliases = new Collection();
  }

  get(name) {
    return super.get(name) || this.aliases.get(name);
  }

  has(name) {
    return super.has(name) || this.aliases.has(name);
  }

  set(command) {
    super.set(command.name, command);
    if (command.aliases && command.aliases.length) for (const alias of command.aliases) this.aliases.set(alias, command);
    return command;
  }

  delete(name) {
    const command = this.resolve(name);
    if (!command) return false;
    super.delete(command.name);
    if (command.aliases && command.aliases.length) for (const alias of command.aliases) this.aliases.delete(alias);
    return true;
  }

  clear() {
    super.clear();
    this.aliases.clear();
  }

}

module.exports = CommandStore;
