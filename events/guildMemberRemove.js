<<<<<<< HEAD
const Event = require(`${process.cwd()}/base/Event.js`);

module.exports = class extends Event {
=======
const { MessageAttachment } = require("discord.js");

module.exports = class {
  constructor(client) {
    this.client = client;
  }
>>>>>>> upstream/Yukine-Refactor

  async run(member) {
    if (!member || !member.id || !member.guild) return;
    const settings = this.client.getSettings(member.guild.id);
<<<<<<< HEAD

    if (!member.user.bot) this.client.points.delete(`${member.guild.id}-${member.id}`);

    member.reminders.forEach(i => {
=======

    if (!member.user.bot) this.client.points.delete(`${member.guild.id}-${member.id}`);
    
    member.reminders.forEach((i) => {
>>>>>>> upstream/Yukine-Refactor
      if (member.guild.id === i.guildid) member.reminders.delete(`${i.id}-${i.reminderTimestamp}`);
    });

    if (settings.welcomeEnabled !== "true") return;
<<<<<<< HEAD

    member.guild.channels.find("name", settings.welcomeChannel)
      .send(`${this.client.emojis.get("396395362748858368")}  ${this.client.responses.welcomeMessages.random().replaceAll("{{user}}", member.user.username).replaceAll("{{amount}}", member.guild.memberCount).replaceAll("{{guild}}", member.guild.name).trim()}`).catch(console.error);
=======
    if (settings.welcomeType === "text") member.guild.channels.find("name", settings.welcomeChannel).send(`${this.client.emojis.get("396391329367588878")}  ${this.client.responses.welcomeMessages.random().replaceAll("{{user}}", member.user.username).replaceAll("{{amount}}", member.guild.memberCount).replaceAll("{{guild}}", member.guild.name).trim()}`).catch(console.error);
    if (settings.welcomeType === "image") member.guild.channels.find("name", settings.welcomeChannel).send(new MessageAttachment(await this.client.idiotAPI.goodbye("anime", member.user.bot, member.user.displayAvatarURL({ format: "png", size: 128 }), encodeURIComponent(member.user.tag), null, null))).catch(console.error);
>>>>>>> upstream/Yukine-Refactor
  }
};
