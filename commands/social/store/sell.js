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
    const name = args.join(" ");

    if (!name) return this.client.commands.get("store").run(message, args, level);
    
    const item = this.client.store.filter(i => i.name.toLowerCase().includes(name.toLowerCase()));
      
    if (!item) return message.channel.send("That item doesn't exist, Please make sure it is spelled correctly");
    if (!message.member.roles.has(item.array()[0].id)) return message.channel.send("You don't have the role :facepalm: ");

    const returnPrice = Math.floor(item.array()[0].price/2);

    const response = await this.client.awaitReply(message, `Are you sure you want to sell ${item.array()[0].name} for ${this.emoji(message.guild.id)}${returnPrice}?`, undefined, null);
    if (["y", "yes"].includes(response.toLowerCase())) {

      message.member.givePoints(returnPrice);
      await message.member.removeRole(item.array()[0].id);
      message.channel.send("You have sold the role :tada: ");

    } else

    if (["n", "no", "cancel"].includes(response.toLowerCase())) {
      message.response(undefined, "Transaction cancelled.");
    }



  }
}

module.exports = Sell;
