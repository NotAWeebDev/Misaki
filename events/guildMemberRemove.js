const Event = require("../structures/Event.js");
const { MessageAttachment } = require("discord.js");

module.exports = class extends Event {

  async run(member) {
    if (!member.guild.available) return;
    if (!member || !member.id || !member.guild) return;
    const settings = this.client.getGuildSettings(member.guild);

    if (!member.user.bot) this.client.points.delete(`${member.guild.id}-${member.id}`);

    member.reminders.forEach(i => {
      if (member.guild.id === i.guildid) member.reminders.delete(`${i.id}-${i.reminderTimestamp}`);
    });


    if (settings.welcomeEnabled !== "true") return;
    const channel = member.guild.channels.find("name", settings.welcomeChannel);
    if (!channel) return;
    if (settings.welcomeType === "text") {
      const message = this.client.responses.goodbyeMessages.random()
        .replaceAll("{{user}}", member.user.username)
        .replaceAll("{{amount}}", member.guild.memberCount)
        .replaceAll("{{guild}}", member.guild.name).trim();
      channel.send(`${this.client.emojis.get("396395362748858368")} ${message}`).catch(console.error);
    }
    if (settings.welcomeType === "image") {
      const image = await this.client.idiotAPI.greeting("goodbye", "anime", member.user.bot, member.user.displayAvatarURL({ format: "png", size: 256 }), member.user.username, member.user.discriminator, member.guild.name, member.guild.memberCount, null);
      channel.send(new MessageAttachment(image)).catch(console.error);
    }

  }
};
