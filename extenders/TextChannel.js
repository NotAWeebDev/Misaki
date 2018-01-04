const { MessageEmbed, Structures } = require("discord.js");

module.exports = Structures.extend("TextChannel", DiscordTextChannel => {
  return class TextChannel extends DiscordTextChannel {

    constructor(...args) {
      super(...args);
      
    }

    buildEmbed() {
      return Object.defineProperty(new MessageEmbed(), "sendToChannel", { value: this });
    }
  };
});