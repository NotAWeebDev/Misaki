const Event = require("../structures/Event.js");
// const { get } = require("snekfetch");
module.exports = class extends Event {

  async run() {
    if (this.client.users.has("1")) this.client.users.delete("1");

    // if (!this.client.settings.has("default")) {
    //   if (!this.client.config.defaultSettings) throw new Error("defaultSettings not preset in config.js or settings database. Bot cannot load.");
    //   this.client.settings.set("default", this.client.config.defaultSettings);
    // }

    this.client.user.setActivity(`@${this.client.user.username} help | ${this.client.guilds.size} Server${this.client.guilds.size > 1 ? "s" : ""}`);

    this.client.console.log(`${this.client.user.tag}, ready to serve ${this.client.users.size} users in ${this.client.guilds.size} servers.`);
    
    setInterval(() => {
      if (this.client.status !== 0) return;
      const toRemind = this.client.reminders.filter(reminder => reminder.reminderTimestamp <= Date.now());
      toRemind.forEach(reminder => {
        this.client.users.get(reminder.id).send(`You asked me to remind you about: \`${reminder.reminder}\` in \`${this.client.guilds.get(reminder.guildid).name}\``);
        this.client.reminders.delete(`${reminder.id}-${reminder.reminderTimestamp}`);
      });
    }, 60000);

    // Upvote Reward Stuff
    // setInterval(async () => {
    //   const { body } = await get("https://discordbots.org/api/bots/396323622953680910/votes?onlyids=true").set("Authorization", process.env.DBLTOKEN);
    //   this.client.upvoters = [];
    //   for (const id of body) {
    //     const members = supportGuild.members;
    //     this.client.upvoters.push(id);
    //     if (members.has(id) && !members.get(id).roles.has(upvoterRole)) {
    //       members.get(id).roles.add(upvoterRole);
    //       console.log(`Added the upvoter role to ${members.get(id).user.username}`);
    //     }
    //   }
    //   for (const id of this.client.methods.util.arrDiff(this.client.upvoters, supportGuild.roles.get(upvoterRole).members.keyArray())) {
    //     const members = supportGuild.members;
    //     members.get(id).roles.remove(upvoterRole);
    //     console.log(`Removed the upvoter role from ${members.get(id).user.tag}`);
    //   }
    // }, 60000);
  }
};
