const { Structures } = require("discord.js");

module.exports = Structures.extend("DMChannel", DMChannel => {
  return class extends DMChannel {

    get readable() {
      return !this.guild || this.permissionsFor(this.guild.me).has("VIEW_CHANNEL");
    }

    get postable() {
      return !this.guild || (this.readable && this.permissionsFor(this.guild.me).has("SEND_MESSAGES"));
    }
    
  };
});