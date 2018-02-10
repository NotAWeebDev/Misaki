function arr_diff(a1, a2) {

  const a = [], diff = [];

  for (let i = 0; i < a1.length; i++) {
    a[a1[i]] = true;
  }

  for (let i = 0; i < a2.length; i++) {
    if (a[a2[i]]) {
      delete a[a2[i]];
    } else {
      a[a2[i]] = true;
    }
  }

  for (const k in a) {
    diff.push(k);
  }

  return diff;
}


const fs = require("fs");
const { get } = require("snekfetch");
module.exports = class {
  constructor(client) {
    this.client = client;
  }

  async run() {
    const supportGuild = this.client.guilds.get("396331425621868554");
    try {
      const { id: rebootMsgID , channel: rebootMsgChan, user: rebootMsgUserID} = JSON.parse(fs.readFileSync(`${process.cwd()}/assets/json/reboot.json`, "utf8"));
      const u = await this.client.users.fetch(rebootMsgUserID);
      const m = await this.client.channels.get(rebootMsgChan).messages.fetch(rebootMsgID);
      await m.edit(`${this.client.responses.bootOneMessages.random().replaceAll("{{user}}", u.username).trim()}`);
      await m.edit(`${this.client.responses.bootTwoMessages.random().replaceAll("{{user}}", u.username).replaceAll("{{ms}}",`${m.editedTimestamp - m.createdTimestamp}`).trim()}`);
      fs.unlink("./reboot.json", ()=>{});
    } catch (O_o) {
      this.client.logger.error(O_o);
    }
    await this.client.wait(1000);

    if (!this.client.settings.has("default")) {
      if (!this.client.config.defaultSettings) throw new Error("defaultSettings not preset in config.js or settings database. Bot cannot load.");
      this.client.settings.set("default", this.client.config.defaultSettings);
    }

    this.client.user.setActivity(`@${this.client.user.username} help | ${this.client.guilds.size} Server${this.client.guilds.size > 1 ? "s" : ""}`);
  
    this.client.logger.log(`${this.client.user.tag}, ready to serve ${this.client.users.size} users in ${this.client.guilds.size} servers.`, "ready");

    setInterval(() => {
      const toRemind = this.client.reminders.filter(r => r.reminderTimestamp <= Date.now());
      toRemind.forEach(reminder => {
        this.client.users.get(reminder.id).send(`You asked me to remind you about: \`${reminder.reminder}\``);
        this.client.reminders.delete(`${reminder.id}-${reminder.reminderTimestamp}`);
      }); 
    }, 60000); 

    // Upvote Reward Stuff
    setInterval(async () => {
      const { body } = await get("https://discordbots.org/api/bots/396323622953680910/votes?onlyids=true").set("Authorization", this.client.config.apiTokens.dblToken);
      const oldUpvoters = this.client.upvoters;
      this.client.upvoters = [];
      for (const id of body) {
        this.client.upvoters.push(id);
        if (supportGuild.members.has(id) && !supportGuild.members.get(id).roles.has("410531245504593920")) {
          supportGuild.members.get(id).roles.add("410531245504593920");
          console.log(`Added the upvoter role to ${supportGuild.members.get(id).user.username}`);
        }
      }
      if (oldUpvoters.length === 0) return;
      for (const id of arr_diff(oldUpvoters, this.client.upvoters)) {
        if (supportGuild.members.has(id) && supportGuild.members.get(id).roles.has("410531245504593920")) {
          supportGuild.members.get(id).roles.remove("410531245504593920");
          console.log(`Removed the upvoter role from ${supportGuild.members.get(id).user.tag}`);
        }
      }
    }, 60000);

  }
};
