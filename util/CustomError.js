class CustomError extends Error {
  constructor(message, messageToEdit) {
    super(message);
    this.msg = messageToEdit;
  }

  get name() {
    return this.constructor.name;
  }
}

class SocialError extends CustomError {}
class ParseError extends CustomError {}
class AnimeError extends CustomError {}
class UsageError extends CustomError {}
class APIError extends CustomError {}

module.exports = { SocialError, ParseError, AnimeError, CustomError, UsageError, APIError };
