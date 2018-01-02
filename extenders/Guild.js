const { Structures } = require("discord.js");

module.exports = Structures.extend("Guild", DiscordGuild => {
  return class Guild extends DiscordGuild {

    constructor(...args) {
      super(...args);
      
    }

    get store() {
      return this.client.store.findAll("guildId", this.id);
    }
  };
});