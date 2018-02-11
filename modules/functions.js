const moment = require("moment");
require("moment-duration-format");
module.exports = (client) => {

  client.arrDiff = function(a, b) {
    if (a === b) return [];
  
    for (const item of a) {
      const ind = b.indexOf(item);
      if (ind !== -1) b.splice(ind, 1);
    }
  
    return b;
  };

  client.ratelimit = async (message, level, key, duration) => {
    if (level > 2) return false;
    
    duration = duration * 1000;
    const ratelimits = client.ratelimits.get(message.author.id) || {}; //get the ENMAP first.
    if (!ratelimits[key]) ratelimits[key] = Date.now() - duration; //see if the command has been run before if not, add the ratelimit
    const differnce = Date.now() - ratelimits[key]; //easier to see the difference
    if (differnce < duration) { //check the if the duration the command was run, is more than the cooldown
      return moment.duration(duration - differnce).format("D [days], H [hours], m [minutes], s [seconds]", 1); //returns a string to send to a channel
    } else {
      ratelimits[key] = Date.now(); //set the key to now, to mark the start of the cooldown
      client.ratelimits.set(message.author.id, ratelimits); //set it
      return true;
    }
  };

  client.awaitReply = async (message, question, filter, limit = 60000, embed) => {
    await message.channel.send(question, embed);
    try {
      const collected = await message.channel.awaitMessages(filter, { max: 1, time: limit, errors: ["time"] });
      return collected.first().content;
    } catch (error) {
      client.logger.error(error);
      return false;
    }
  };

  client.randomNum = async (min, max) => {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

  String.prototype.toProperCase = function() {
    return this.replace(/([^\W_]+[^\s-]*) */g, function(txt) {return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
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

  Array.prototype.remove = function() {
    var value, a = arguments,
      L = a.length,
      ax;
    while (L && this.length) {
      value = a[--L];
      while ((ax = this.indexOf(value)) !== -1) {
        this.splice(ax, 1);
      }
    }
    return this;
  };

  client.wait = require("util").promisify(setTimeout);

  process.on("uncaughtException", (err) => {
    const errorMsg = err.stack.replace(new RegExp(`${__dirname}/`, "g"), "./");
    client.logger.error(`Uncaught Exception: ${errorMsg}`);
    process.exit(1);
  });

  process.on("unhandledRejection", err => {
    console.log(err);
    // client.logger.error(`Uncaught Promise Error: ${err}`);
  });
};