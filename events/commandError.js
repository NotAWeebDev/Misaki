const { CustomError } = require("../util/CustomError.js");

module.exports = class {
  constructor(client) {
    this.client = client;
  }

  async run(error, message) {
    if (error instanceof CustomError) {
      if (error.msg) {
        return error.msg.edit(error.message);
      } else { 
        return message.channel.send(error.message);
      }
    }
    message.channel.send("Something went wrong, please try again later");
    this.client.logger.error(error);
  }
};
