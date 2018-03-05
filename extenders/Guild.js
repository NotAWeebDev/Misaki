const { Structures } = require("discord.js");

module.exports = Structures.extend("Guild", DiscordGuild => {
  return class MisakiGuild extends DiscordGuild {
    get store() {
      return this.client.store.findAll("guildId", this.id);
    }
  };
});