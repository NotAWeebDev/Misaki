const { ParseError, SocialError, AnimeError } = require("../util/CustomError.js");

module.exports = class {
  constructor(client) {
    this.client = client;
  }

  async run(message, error) {
    if (error instanceof ParseError) {
      if (error.msg) error.msg.edit(error.message);
      else message.channel.send(error.message);
      return;
    }
    if (error instanceof SocialError) return error.msg.edit(error.message);
    if (error instanceof AnimeError) return error.msg.edit(error.message);
    message.channel.send("Something went wrong, please try again later");
    this.client.logger.error(error);
  }
};
