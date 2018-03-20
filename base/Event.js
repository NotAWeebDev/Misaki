class Event {

  constructor(client, file, options = {}) {
    this.client = client;
    this.name = options.name || file.name;
    this.enabled = "enabled" in options ? options.enabled : true;
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

  reload() {
    return this.client.events.load(this.file.path);
  }

}

module.exports = Event;
