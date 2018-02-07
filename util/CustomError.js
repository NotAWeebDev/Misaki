class CustomError extends Error {
  constructor(message, messageToEdit) {
    super(message);
    this.msg = messageToEdit;
  }
}

class SocialError extends CustomError {
  constructor(...args) {
    super(...args);
    this.name = this.constructor.name;
  }
}

class ParseError extends CustomError {
  constructor(...args) {
    super(...args);
    this.name = this.constructor.name;
  }
}

class AnimeError extends CustomError {
  constructor(...args) {
    super(...args);
    this.name = this.constructor.name;
  }
}

class UsageError extends CustomError {
  constructor(...args) {
    super(...args);
    this.name = this.constructor.name;
  }
}
module.exports = { SocialError, ParseError, AnimeError, CustomError, UsageError };
