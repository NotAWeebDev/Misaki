const Event = require("../structures/Event.js");
// const { get } = require("snekfetch");
module.exports = class extends Event {

  async run() {
    if (this.client.users.has("1")) this.client.users.delete("1");

    this.client.user.setActivity(`@${this.client.user.username} help | ${this.client.guilds.size.toLocaleString()} Server${this.client.guilds.size > 1 ? "s" : ""}`);

    this.client.console.log(`${this.client.user.tag}, ready to serve ${this.client.users.size} users in ${this.client.guilds.size} servers.`);
    
    setInterval(() => {
      if (this.client.ws.shards[0].status !== 0) return;
      const toRemind = this.client.reminders.filter(reminder => reminder.reminderTimestamp <= Date.now());
      toRemind.forEach(reminder => {
        this.client.users.get(reminder.id).send(`You asked me to remind you about: \`${reminder.reminder}\` in \`${this.client.guilds.get(reminder.guildid).name}\``);
        this.client.reminders.delete(`${reminder.id}-${reminder.reminderTimestamp}`);
      });
    }, 60000);

  }
};
