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
    
    const item = this.client.store.find("name", name);

    if (!item) return message.channel.send("That item doesn't exist, Please make sure it is spelled correctly");
    if (message.member.roles.has(item.id)) return message.channel.send("You already have the role :facepalm: ");

    if (item.price > message.member.score.points) {
      return message.channel.send(`You currently have ${this.emoji(message.guild.id)}${message.member.score.points}, but the role costs ${item.price}!`);
    }

    const response = await this.client.awaitReply(message, `Are you sure you want to purchase ${item.name} for ${this.emoji(message.guild.id)}${item.price}?`, undefined, null);
    if (["y", "yes"].includes(response)) {

      message.member.takePoints(item.price);
      await message.member.addRole(item.id);
      message.channel.send("You have bought the role :tada: ");

    } else

    if (["n", "no", "cancel"].includes(response)) {
      message.response(undefined, "Transaction cancelled.");
    }
  }
}

module.exports = Buy;
