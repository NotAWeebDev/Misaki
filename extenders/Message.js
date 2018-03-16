const { Structures } = require("discord.js");

module.exports = Structures.extend("Message", Message => class extends Message {

  constructor(...args) {
    super(...args);

    this.settings = this.guild ? this.client.getSettings(this.guild.id) : this.client.settings.get("default");

    this.flags = [];
  }

  response(emoji = "❌", content, embed, options = {}) { // eslint-disable-line no-unused-vars
    return this.channel.send(`${this.author} \`|${emoji}|\` ${content}`, embed);
  }

  async awaitReply(question, filter, limit = 60000, embed) {
    await this.channel.send(question, embed);
    try {
      const collected = await this.channel.awaitMessages(filter, { max: 1, time: limit, errors: ["time"] });
      return collected.first().content;
    } catch (error) {
      this.client.console.error(error);
      return false;
    }
  }

});
