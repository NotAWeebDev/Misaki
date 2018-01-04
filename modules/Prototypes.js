const { MessageEmbed, TextChannel, DMChannel, User } = require("discord.js");

MessageEmbed.prototype.send = function(content) {
  if (!this.sendToChannel || !(this.sendToChannel instanceof TextChannel || this.sendToChannel instanceof User || this.sendToChannel instanceof DMChannel)) return Promise.reject("Embed not created in a channel");
  return this.sendToChannel.send(content || "", { embed: this });
};