const Store = require("./Store");

class EventStore extends Store {

  constructor(client) {
    super(client, "events");
  }

  set(event) {
    super.set(event);
    this.client.on(event.name, event._run.bind(event));
    return event;
  }

  delete(name) {
    const event = this.get(name);
    if (!event) return false;
    this.client.removeAllListeners(event.name);
    return super.delete(event.name);
  }

  clear() {
    for (const event of this.keys()) this.delete(event);
  }

}

module.exports = EventStore;
