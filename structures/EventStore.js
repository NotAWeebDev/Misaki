const { Collection } = require("discord.js");

class EventStore extends Collection {

  constructor(client) {
    super();

    Object.defineProperty(this, "client", { value: client });
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
    if (existing) this.delete(existing);
    this.client.on(event.name, event._run.bind(event));
    super.set(event.name, event);
    return event;
  }

}

module.exports = EventStore;
