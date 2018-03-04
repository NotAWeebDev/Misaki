const { Structures } = require("discord.js");

module.exports = Structures.extend("Message", DiscordMessage => {
  return class MisakiMessage extends DiscordMessage {

    constructor(...args) {
      super(...args);

      this.settings = this.guild ? this.client.getSettings(this.guild.id) : this.client.settings.get("default");
      
      this.flags = [];
    }

    response(emoji = "❌", content, embed, options = {}) { // eslint-disable-line no-unused-vars
      return this.channel.send(`${this.author} \`|${emoji}|\` ${content}`, embed);
    }

  };
});
