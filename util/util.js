class Util {
  constructor() {
    throw new Error("This class may not be initiated with new");
  }
}

Util.wait = require("util").promisify(setTimeout);

module.exports = Util;