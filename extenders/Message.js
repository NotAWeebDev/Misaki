const { Structures } = require("discord.js");

module.exports = Structures.extend("Message", DiscordMessage => {
  return class Message extends DiscordMessage {

    constructor(...args) {
      super(...args);
    }

    response(emoji = "❌", content, embed, options = {}) { // eslint-disable-line no-unused-vars
      return this.channel.send(`${this.author} \`|${emoji}|\` ${content}`, embed);
    }

    buildEmbed() {
      return this.channel.buildEmbed();
    }

  };
});
