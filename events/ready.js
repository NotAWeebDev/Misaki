module.exports = class {
  constructor(client) {
    this.client = client;
  }

  async run() {

    await this.client.wait(1000);

    if (!this.client.settings.has("default")) {
      if (!this.client.config.defaultSettings) throw new Error("defaultSettings not preset in config.js or settings database. Bot cannot load.");
      this.client.settings.set("default", this.client.config.defaultSettings);
    }
    
    setInterval(() => {
      const toRemind = this.client.reminders.filter(r => r.reminderTimestamp <= Date.now());
      toRemind.forEach(reminder => {
        this.client.users.get(reminder.id).send(`You asked me to remind you about: \`${reminder.reminder}\` in \`${this.client.guilds.get(reminder.guildid).name}\``);
        this.client.reminders.delete(`${reminder.id}-${reminder.reminderTimestamp}`);
      }); 
    }, 60000); 
    
    this.client.user.setActivity(`@${this.client.user.username} help | ${this.client.guilds.size} Server${this.client.guilds.size > 1 ? "s" : ""}`);
  
    this.client.logger.log(`${this.client.user.tag}, ready to serve ${this.client.users.size} users in ${this.client.guilds.size} servers.`, "ready");
  }
};
