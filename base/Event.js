class Event {

  constructor(client, file, options = {}) {
    this.client = client;

    this.name = options.name || file.split(".")[0];
    this.enabled = options.enabled || true;
    this.file = file;
  }

  async _run(...args) {
    if (this.enabled) {
      try {
        await this.run(...args);
      } catch (err) {
        this.client.logger.error(err);
      }
    }
  }

  unload() {
    return this.client.events.delete(this);
  }

  disable() {
    this.enabled = false;
    return this;
  }

  enable() {
    this.enabled = true;
    return this;
  }

}

module.exports = Event;