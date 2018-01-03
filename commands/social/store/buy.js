const Social = require(`${process.cwd()}/base/Social.js`);

class Buy extends Social {
  constructor(client) {
    super(client, {
      name: "buy",
      description: "Displays your current score.",
      usage: "buy <role:string>",
      category: "Social",
      aliases: []
    });
  }

  async run(message, args, level) { // eslint-disable-line no-unused-vars
    const name = args.join(" ");

    if (!name) return this.client.commands.get("store").run(message, args, level);
    
    const item = this.client.store.filter(i => i.name.toLowerCase().includes(name.toLowerCase()));

    if (!item) return message.channel.send("That item doesn't exist, Please make sure it is spelled correctly");
    if (message.member.roles.has(item.array()[0].id)) return message.channel.send("You already have the role :facepalm: ");

    if (item.array()[0].price > message.member.score.points) {
      return message.channel.send(`You currently have ${this.emoji(message.guild.id)}${message.member.score.points}, but the role costs ${item.array()[0].price}!`);
    }

    const response = await this.client.awaitReply(message, `Are you sure you want to purchase ${item.array()[0].name} for ${this.emoji(message.guild.id)}${item.array()[0].price}?`, undefined, null);
    if (["y", "yes"].includes(response.toLowerCase())) {

      message.member.takePoints(item.array()[0].price);
      await message.member.addRole(item.array()[0].id);
      message.channel.send("You have bought the role :tada: ");

    } else

    if (["n", "no", "cancel"].includes(response.toLowerCase())) {
      message.response(undefined, "Transaction cancelled.");
    }
  }
}

module.exports = Buy;
