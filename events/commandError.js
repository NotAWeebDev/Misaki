const Event = require("../structures/Event.js");

module.exports = class extends Event {

  async run(error, message) {
    if (error instanceof this.client.methods.errors.CustomError) {
      if (error.msg) return error.msg.edit(error.message);
      return message.channel.send(error.message);
    }
    message.channel.send("Something went wrong, please try again later");
    this.client.console.error(error);
  }
};
