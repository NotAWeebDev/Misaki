const Owner = require("../../structures/Owner.js");

const statusObject = {
  0: "Dispatch",
  1: "Heartbeat",
  2: "Identify",
  3: "Status Update",
  4: "Voice State Update",
  5: "Voice Server Ping",
  6: "Resume",
  7: "Reconnect",
  8: "Request Guild Members",
  9: "Invalid Session",
  10: "Hello",
  11: "Heartbeat ACK",
};

class Health extends Owner {
  constructor(...args) {
    super(...args, {
      name: "health",
      description: "This will check on the health of the shards.",
      usage: "health",
      aliases: ["shards"],
      category: "Owner",
      permLevel: "Bot Owner"
    });
  }

  async run(message, args, level) { // eslint-disable-line no-unused-vars
    const output = [];

    const counts = new Array(this.client.options.shardCount).fill(0);
    for (const guild of this.client.guilds.values()) counts[guild.shardID]++;
    counts;
    
    const { shards } = this.client.ws;
    for (let i = 0; i < shards.length; i++) {
      output.push(`Shard ${i}: STATUS: ${statusObject[shards[i].status]}, with ${counts[i]} guilds`);
    }
    
    message.channel.send(output, { codeblock: "http" });  }
}

module.exports = Health;
