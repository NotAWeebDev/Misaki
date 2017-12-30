module.exports = class {
  constructor(client) {
    this.client = client;
  }

  async run(member) {
    const settings = this.client.getSettings(member.guild.id);
    if (settings.welcomeEnabled !== "true") return;

    member.guild.channels.find("name", settings.welcomeChannel).send(`${this.client.emojis.get("396395362748858368")}  ${this.client.responses.goodbyeMessages.random().replaceAll("{{user}}", member.user.username).trim()}`).catch(console.error);
  }
};
