const Owner = require("../../structures/Owner.js");

const statuses = [
  "Ready",
  "Connecting",
  "Reconnecting",
  "Idle",
  "Nearly",
  "Disconnected"
];

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
      output.push(`Shard ${i}: STATUS: ${statuses[shards[i].status]}, with ${counts[i]} guilds`);
    }
    
    message.channel.send(output, { codeblock: "http" });
  }
}

module.exports = Health;
