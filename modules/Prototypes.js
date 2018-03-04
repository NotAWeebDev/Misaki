/*
  WARNING: These are some handy prototype functions for String and Array, extending of native prototypes is a bad practice
*/
const { MessageEmbed, TextChannel, DMChannel, User } = require("discord.js");

MessageEmbed.prototype.send = function(content = "") {
  if (!this.sendToChannel || !(this.sendToChannel instanceof TextChannel || this.sendToChannel instanceof User || this.sendToChannel instanceof DMChannel)) return Promise.reject("Embed not created in a channel");
  return this.sendToChannel.send(content, { embed: this });
};

String.prototype.toProperCase = function() {
  return this.replace(/([^\W_]+[^\s-]*) */g, txt => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
};

String.prototype.toPlural = function() {
  return this.replace(/((?:\D|^)1 .+?)s/g, "$1");
};

String.prototype.replaceAll = function(search, replacement) {
  return this.replace(RegExp(search, "gi"), replacement);
};

String.prototype.isNumber = function() { 
  return /^\d+$/.test(this);
};

Array.prototype.random = function() {
  return this[Math.floor(Math.random() * this.length)];
};

Array.prototype.remove = function(element) {
  const index = this.indexOf(element); 
  if (index !== -1) this.splice(index, 1);
  return this;
};