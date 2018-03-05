const Event = require(`${process.cwd()}/base/Event.js`);

module.exports = class extends Event {

  async run(member) {
    if (!member || !member.id || !member.guild) return;

    const settings = this.client.getSettings(member.guild.id);
    if (settings.welcomeEnabled !== "true") return;

    member.guild.channels.find("name", settings.welcomeChannel)
      .send(`${this.client.emojis.get("396391329367588878")}  ${this.client.responses.welcomeMessages.random().replaceAll("{{user}}", member.user.username).replaceAll("{{amount}}", member.guild.memberCount).replaceAll("{{guild}}", member.guild.name).trim()}`).catch(console.error);
  }
};
