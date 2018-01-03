const Social = require(`${process.cwd()}/base/Social.js`);

class Sell extends Social {
  constructor(client) {
    super(client, {
      name: "sell",
      description: "Sell a role you bought and recieve half the price back.",
      usage: "sell <role:string>",
      aliases: []
    });
  }

  async run(message, args, level) { // eslint-disable-line no-unused-vars
    const name = args.join(" ").toLowerCase();

    if (!name) return this.client.commands.get("store").run(message, args, level);
    
    // We are taking the Role name given by author and finding it from the Map
    const item = this.client.store.find("name", name);
    // This verifies as to if there is a item on sale
    if (!item) return message.channel.send("That item doesn't exist, Please make sure it is spelled correctly");
    if (!message.member.roles.has(item.id)) return message.channel.send("You don't have the role :facepalm: ");

    const score = this.client.points.get(`${message.guild.id}-${message.author.id}`);
    const returnPrice = Math.ceil(item.price/2) 
    score.points += returnPrice;
    this.client.points.set(`${message.guild.id}-${message.author.id}`, score);
    
    await message.member.removeRole(item.id);
    message.channel.send("You have sold the role :tada: ");
  }
}

module.exports = Sell;
