const moment = require("moment");
require("moment-duration-format");
module.exports = (client) => {

  client.ratelimit = async (message, level, key, duration) => {
    if (level > 1) return false;
    
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

  client.awaitReply = async (msg, question, limit = 60000) => {
    const filter = m => m.author.id === msg.author.id;
    await msg.channel.send(question);
    try {
      const collected = await msg.channel.awaitMessages(filter, { max: 1, time: limit, errors: ["time"] });
      return collected.first().content;
    } catch (e) {
      return false;
    }
  };

  client.clean = async (client, text) => {
    if (text && text.constructor.name == "Promise")
      text = await text;
    if (typeof evaled !== "string")
      text = require("util").inspect(text, {depth: 0});

    text = text
      .replace(/`/g, "`" + String.fromCharCode(8203))
      .replace(/@/g, "@" + String.fromCharCode(8203))
      .replace(client.token, "mfa.VkO_2G4Qv3T--NO--lWetW_tjND--TOKEN--QFTm6YGtzq9PH--4U--tG0");

    return text;
  };

  String.prototype.toProperCase = function() {
    return this.replace(/([^\W_]+[^\s-]*) */g, function(txt) {return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
  };

  String.prototype.toPlural = function() {
    return this.replace(/((?:\D|^)1 .+?)s/g, "$1");
  };

  Array.prototype.random = function() {
    return this[Math.floor(Math.random() * this.length)];
  };

  String.prototype.replaceAll = function(search, replacement) {
    return this.replace(RegExp(search, "gi"), replacement);
  };

  String.prototype.isNumber = function() { 
    return /^\d+$/.test(this);
  };

  client.wait = require("util").promisify(setTimeout);

  process.on("uncaughtException", (err) => {
    const errorMsg = err.stack.replace(new RegExp(`${__dirname}/`, "g"), "./");
    console.error("Uncaught Exception: ", errorMsg);
    process.exit(1);
  });

  process.on("unhandledRejection", err => {
    console.error("Uncaught Promise Error: ", err);
  });
};