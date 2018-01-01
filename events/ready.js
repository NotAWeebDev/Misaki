const fs = require("fs");
module.exports = class {
  constructor(client) {
    this.client = client;
  }

  async run() {
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

    this.client.appInfo = await this.client.fetchApplication();
    setInterval( async () => {
      this.client.appInfo = await this.client.fetchApplication();
    }, 60000);

    if (!this.client.settings.has("default")) {
      if (!this.client.config.defaultSettings) throw new Error("defaultSettings not preset in config.js or settings database. Bot cannot load.");
      this.client.settings.set("default", this.client.config.defaultSettings);
    }

    this.client.user.setActivity(`@${this.client.user.username} help | ${this.client.guilds.size} Servers`);
  
    this.client.logger.log(`${this.client.user.tag}, ready to serve ${this.client.users.size} users in ${this.client.guilds.size} servers.`, "ready");
  }
};
