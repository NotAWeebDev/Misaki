const Social = require(`${process.cwd()}/base/Social.js`);

class Buy extends Social {
  constructor(client) {
    super(client, {
      name: "buy",
      description: "Displays your current score.",
      usage: "buy <role:string>",
      aliases: []
    });
  }

  async run(message, args, level) { // eslint-disable-line no-unused-vars
    const name = args.join(" ").toLowerCase();

    if (!name) return this.client.commands.get("store").run(message, args, level);
    
    const item = this.client.CurrencyShop.find("name", name);

    if (!item) return message.channel.send("That item doesn't exist, Please make sure it is spelled correctly");
    if (message.member.roles.has(item.id)) return message.channel.send("You already have the role :facepalm: ");

    if (item.price > this.client.points.get(`${message.guild.id}-${message.author.id}`).points) {
      return message.channel.send(`You currently have ${this.client.points.get(`${message.guild.id}-${message.author.id}`).points}, but the ${item.name} costs ${item.price}!`);
    }

    const score = this.client.points.get(`${message.guild.id}-${message.author.id}`);
    score.points -= item.price;
    this.client.points.set(`${message.guild.id}-${message.author.id}`, score);
    
    await message.member.addRole(item.id);
    message.channel.send("You have bought the role :tada: ");
  }
}

module.exports = Buy;
