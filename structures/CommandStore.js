const { Collection } = require("discord.js");
const path = require("path");
const fs = require("fs-nextra");

class CommandStore extends Collection {

  constructor(client) {
    super();

    this.client = client;
    this.name = "commands";
    this.aliases = new Collection();
  }

  get dir() {
    return `${path.dirname(require.main.filename)}${path.sep}commands`;
  }

  get(name) {
    return super.get(name) || this.aliases.get(name);
  }

  has(name) {
    return super.has(name) || this.aliases.has(name);
  }

  set(command) {
    const existing = this.get(command.name);
    if (existing) this.delete(command.name);
    super.set(command.name, command);
    if (command.aliases && command.aliases.length) for (const alias of command.aliases) this.aliases.set(alias, command);
    return command;
  }

  delete(name) {
    const command = this.get(name);
    if (!command) return false;
    super.delete(command.name);
    if (command.aliases && command.aliases.length) for (const alias of command.aliases) this.aliases.delete(alias);
    return true;
  }

  clear() {
    super.clear();
    this.aliases.clear();
  }

  load(file) {
    const filepath = path.join(this.dir, ...file);
    let piece = null;
    try {
      piece = this.set(new (require(filepath))(this.client, file));
    } catch (error) {
      this.client.console.error(`Failed to load command (${filepath}).Error:\n${error.stack || error}`);
    }
    delete require.cache[filepath];
    return piece;
  }

  async loadAll() {
    this.clear();
    await this.walkFiles();
    return this.size;
  }

  async walkFiles() {
    const files = await fs.scan(this.dir, { 
      filter: (stats, filepath) => stats.isFile() && path.extname(filepath) === ".js"
    }).catch(() => null);
    if (!files) return true;
    return Promise.all([...files.keys()].map(file => this.load(path.relative(this.dir, file).split(path.sep))));
  }
}

module.exports = CommandStore;
