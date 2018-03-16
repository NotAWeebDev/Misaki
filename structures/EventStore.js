const { Collection } = require("discord.js");
const path = require("path");
const fs = require("fs-nextra");

class EventStore extends Collection {

  constructor(client) {
    super();

    this.client = client;
    this.name = "events";
  }

  get dir() {
    return `${path.dirname(require.main.filename)}${path.sep}events`;
  }

  clear() {
    for (const event of this.keys()) this.delete(event);
  }

  delete(name) {
    const event = this.get(name);
    if (!event) return false;
    this.client.removeAllListeners(event.name);
    super.delete(event.name);
    return true;
  }

  set(event) {
    const existing = this.get(event.name);
    if (existing) this.delete(event.name);
    this.client.on(event.name, event._run.bind(event));
    super.set(event.name, event);
    return event;
  }

  load(file) {
    const filepath = path.join(this.dir, ...file);
    let piece = null;
    try {
      piece = this.set(new (require(filepath))(this.client, file));
    } catch (error) {
      this.client.console.error(`Failed to load event (${filepath}).Error:\n${error.stack || error}`);
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

module.exports = EventStore;
