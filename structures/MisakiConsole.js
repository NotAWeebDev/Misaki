/**
 * WARNING: This console is heavily inspired by KlasaConsole
 */
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
    data = MisakiConsole._flatten(data);
    const { time, shard, message } = MisakiConsole.COLORS[type];
    const timestamp = `${time.opening}[${this.timestamp}]${time.closing}`;
    // Misaki isnt sharded yet, so leaving this here
    const shd = this.client.shard ? `${shard.opening}[${this.client.shard.id}]${shard.closing}` : "";
    super[MisakiConsole.TYPES[type] || "log"](data.split("\n").map(str => `${timestamp}${shd} ${message.opening}${str}${message.closing}`).join("\n"));
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

  static _flatten(data) {
    if (typeof data === "undefined" || typeof data === "number" || data === null) return String(data);
    if (typeof data === "string") return data;
    if (typeof data === "object" && data !== null) {
      if (Array.isArray(data)) return data.join("\n");
      return data.stack || data.message || inspect(data, { depth: 0, colors: true });
    }
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
    shard: { opening: "\u001b[46;30m", closing: "\u001b[49;39m" },
    message: { opening: "\u001b[m", closing: "\u001b[m" } 
  },
  error: { 
    time: { opening: "\u001b[41m", closing: "\u001b[49m" },
    shard: { opening: "\u001b[46;30m", closing: "\u001b[49;39m" },
    message: { opening: "\u001b[m", closing: "\u001b[m" } 
  },
  log: {
    time: { opening: "\u001b[44m", closing: "\u001b[49m" },
    shard: { opening: "\u001b[46;30m", closing: "\u001b[49;39m" },
    message: { opening: "\u001b[m", closing: "\u001b[m" }
  },
  warn: { 
    time: { opening: "\u001b[103;30m", closing: "\u001b[49;39m" },
    shard: { opening: "\u001b[46;30m", closing: "\u001b[49;39m" },
    message: { opening: "\u001b[m", closing: "\u001b[m" }
  }
};

module.exports = MisakiConsole;