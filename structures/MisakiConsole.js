const { Console } = require("console");
const moment = require("moment");
const { inspect } = require("util");

class MisakiConsole extends Console {
  constructor(client, options = {}) {
    super(options.stdout || process.stdout, options.stderr || process.stderr);

    Object.defineProperty(this, "client", { value: client });
    Object.defineProperty(this, "stdout", { value: options.stdout });
    Object.defineProperty(this, "stderr", { value: options.stderr });

    this.template = options.timestamp || "YYYY-MM-DD HH:mm:ss";
  }

  get timestamp() {
    return moment().format(this.template);
  }

  write(data, type = "log") {
    type = type.toLowerCase();
    data = MisakiConsole.parseData(data);
    const { time, message } = MisakiConsole.COLORS[type];
    const timestamp = `${time.opening}[${this.timestamp}]${time.closing}`;
    const messageStr = str => `${message.opening}${str}${message.closing}`;
    super[MisakiConsole.TYPES[type] || "log"](data.split("\n").map(str => `${timestamp} ${messageStr(str)}`).join("\n"));
  }

  log(...data) {
    this.write(data, "log");
  }

  warn(...data) {
    this.write(data, "warn");
  }

  error(...data) {
    this.write(data, "error");
  }

  debug(...data) {
    this.write(data, "debug");
  }

  static parseData(data) {
    if (Array.isArray(data)) return data.join("\n");
    if (typeof data === "object" && data !== null) return inspect(data, { depth: 0, colors: true });
    if (data && data.constructor === Error) return data.stack || data.message || String(data);
    return String(data);
  }
}

MisakiConsole.TYPES = {
  debug: "log",
  error: "error",
  log: "log",
  warn: "warn"
};

MisakiConsole.COLORS = { 
  debug: {
    time: { opening: "\u001b[45m", closing: "\u001b[49m" },
    message: { opening: "\u001b[m", closing: "\u001b[m" } 
  },
  error: { 
    time: { opening: "\u001b[41m", closing: "\u001b[49m" },
    message: { opening: "\u001b[m", closing: "\u001b[m" } 
  },
  log: {
    time: { opening: "\u001b[44m", closing: "\u001b[49m" },
    message: { opening: "\u001b[m", closing: "\u001b[m" }
  },
  warn: { 
    time: { opening: "\u001b[103;30m", closing: "\u001b[49;39m" },
    message: { opening: "\u001b[m", closing: "\u001b[m" }
  }
};

module.exports = MisakiConsole;