const Owner = require(`${process.cwd()}/base/Owner.js`);
const { promisify } = require("util");
const writeSnapshot = promisify(require("heapdump").writeSnapshot);

class SysDump extends Owner {
  constructor(client) {
    super(client, {
      name: "sysdump",
      description: "Writes a memory snapshot for debugging.",
      usage: "sysdump"
    });
  }

  async run(message, args, level) { // eslint-disable-line no-unused-vars
    const filename = await writeSnapshot(`./${Date.now()}.heapsnapshot`);
    message.reply(`Created new heapdump : ${filename}`);
  }
}

module.exports = SysDump;