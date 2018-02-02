class SocialError extends Error {
  constructor(message) {
    super(message);
    this.name = this.constructor.name;
  }
}

class ParseError extends Error {
  constructor(message, messageToEdit) {
    super(message);
    this.msg = messageToEdit;
    this.name = this.constructor.name;
  }
}

module.exports = { SocialError, ParseError };
