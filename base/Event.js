class Event {

  constructor(client, file, options = {}) {
    this.client = client;

    this.name = options.name || file[file.length - 1].slice(0, -3);
    this.enabled = "enabled" in options ? options.enabled : true;
    this.store = this.client.events;
    this.file = file;
  }

  async _run(...args) {
    if (this.enabled) {
      try {
        await this.run(...args);
      } catch (err) {
        this.client.console.error(err);
      }
    }
  }

  unload() {
    return this.client.events.delete(this.name);
  }

  disable() {
    this.enabled = false;
    return this;
  }

  enable() {
    this.enabled = true;
    return this;
  }

  reload() {
    return this.client.events.load(this.file);
  }
}

module.exports = Event;
