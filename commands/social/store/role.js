const Social = require(`${process.cwd()}/base/Social.js`);

class Role extends Social {
  constructor(client) {
    super(client, {
      name: "role",
      description: "Modify the default configuration for all guilds.",
      category: "System",
      usage: "conf <view/get/edit> <key> <value>",
      guildOnly: true,
      aliases: ["defaults"],
      permLevel: "Bot Admin"
    });
  }

  async run(message, args, level) { // eslint-disable-line no-unused-vars
    const action = args.shift();
    const price = args.pop();
    const name = args.join(" ");
    if (action === "add") {
      // If they have not given a name
      if (!name) return message.reply("Please add the exact name of the role");
      // If the name they have given is not valid
      if (!message.guild.roles.find("name", name)) return message.reply("Please Enter The **Correct** Name Of The Role");
      // If the role is already on sale
      if (this.client.CurrencyShop.has(name)) return message.reply("This role is already on sale");
      // If they have not specified a price
      if (!price) return message.reply("Please specify a price");
      // Creating a new object and setting values
      const role = new Object();
      role.name = name.toLowerCase();
      role.id = message.guild.roles.find("name", name).id.toString();
      role.price = price;
      role.type = "Roles";
      // Adding the Object to the Map
      this.client.CurrencyShop.set(role.id , role);
      message.reply(`${name} is now on sale `);
    } else if (action === "del") {
      // If there is no name
      if (!name) return message.reply("Please specify the exact name of the role");
      // If the role does not exist on the map and is not on sale
      if (!this.client.CurrencyShop.has(name)) return message.reply("This role is not on sale");
      // Confirming the Action
      const response = await this.client.awaitReply(message, `Are you sure you want to remove ${name} from the shop?`);
      if (["y", "yes"].includes(response)) {
        // Deleting the role from store
        await this.client.CurrencyShop.delete(name);
        message.reply("The role is now off the store.");
      } else
      // If they respond with n or no, we inform them that the action has been cancelled.
      if (["n","no","cancel"].includes(response)) {
        message.reply("Action cancelled.");
      }
    }
  }
}
module.exports = Role;
