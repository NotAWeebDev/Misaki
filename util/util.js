class Util {
  constructor() {
    throw new Error("This class may not be initiated with new");
  }

  static regExpEsc(str) {
    return str.replace(Util.REGEXPESC, "\\$&");
  }

  static arrDiff(a, b) {
    if (a === b) return [];

    for (const item of a) {
      const ind = b.indexOf(item);
      if (ind !== -1) b.splice(ind, 1);
    }

    return b;
  }
}

Util.wait = require("util").promisify(setTimeout);

Util.REGEXPESC = /[-/\\^$*+?.()|[\]{}]/g;

module.exports = Util;