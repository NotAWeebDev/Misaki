const { Structures } = require("discord.js");

module.exports = Structures.extend("Message", Message => class extends Message {

  constructor(...args) {
    super(...args);

    this.settings = this.client.getGuildSettings(this.guild);

    this.flags = [];
  }

  get member() {
    if (this.guild) return super.member;
    return { "user": this.channel.recipient, "displayName": this.channel.recipient.username };
  }

  response(emoji = "❌", content, embed, options = {}) {
    return this.channel.send(`${this.author} \`|${emoji}|\` ${content}`, Object.assign({}, options,  { embed }));
  }

  async awaitReply(question, filter, limit = 60000) {
    const msg = await this.channel.send(question);
    return [await this.channel.awaitMessages(filter, { max: 1, time: limit, errors: ["time"] })
      .then(collected => collected.first().content)
      .catch(() => false), msg];
  }

});