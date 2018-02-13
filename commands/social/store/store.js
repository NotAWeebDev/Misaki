const Social = require(`${process.cwd()}/base/Social.js`);

const buyToken = async (name, message, client) => {
  if (parseInt(message.settings.tokenPrice) > parseInt(message.member.score.points)) {
    return message.channel.send(`You currently have ₲${parseInt(message.member.score.points).toLocaleString()}, but the token costs ${parseInt(message.settings.tokenPrice).toLocaleString()}!`);
  }
  const filter = m => m.author.id === message.author.id;
  const response = await client.awaitReply(message, `Are you sure you want to purchase a Slot Token for ₲${message.settings.tokenPrice}?`, filter, undefined, null);
  if (["y", "yes"].includes(response.toLowerCase())) {
  
    message.member.takePoints(parseInt(message.settings.tokenPrice));
    await message.member.giveItem("tokens", 1);
    message.channel.send("You have bought a token");
  
  } else
  
  if (["n", "no", "cancel"].includes(response.toLowerCase())) {
    message.response(undefined, "Transaction cancelled.");
  }
};

const buyRole = async (name, message, client) => {
  const item = client.store.filter(i => i.name.toLowerCase().includes(name.toLowerCase()));
  
  if (item.size > 1) return message.reply(`B..Baka! Be more specific more than that, there is more than one item on sale with ${name} as their name`);
  if (!item) return message.channel.send("That item doesn't exist, Please make sure it is spelled correctly");
  if (message.member.roles.has(item.array()[0].id)) return message.channel.send("You already have the role :facepalm: ");
  
  if (parseInt(item.array()[0].price) > parseInt(message.member.score.points)) {
    return message.channel.send(`You currently have ₲${parseInt(message.member.score.points).toLocaleString()}, but the role costs ${parseInt(item.array()[0].price).toLocaleString()}!`);
  }

  const filter = m => m.author.id === message.author.id;
  const response = await client.awaitReply(message, `Are you sure you want to purchase ${item.array()[0].name} for ₲${item.array()[0].price.toLocaleString()}?`, filter, undefined, null);
  if (["y", "yes"].includes(response.toLowerCase())) {
  
    message.member.takePoints(parseInt(item.array()[0].price));
    await message.member.roles.add(item.array()[0].id);
    message.channel.send("You have bought the role :tada: ");
  
  } else
  
  if (["n", "no", "cancel"].includes(response.toLowerCase())) {
    message.response(undefined, "Transaction cancelled.");
  }
};

const sellToken = async (name, message, client) => {
  const returnPrice = parseInt(message.settings.tokenPrice) / 2;
  const filter = m => m.author.id === message.author.id;
  const response = await client.awaitReply(message, `Are you sure you want to sell a Token for ₲${returnPrice}?`, filter, undefined, null);
  if (["y", "yes"].includes(response.toLowerCase())) {
  
    message.member.takePoints(returnPrice);
    message.member.takeItem("tokens", 1);
    message.channel.send("You have sold a token");
  
  } else
  
  if (["n", "no", "cancel"].includes(response.toLowerCase())) {
    message.response(undefined, "Transaction cancelled.");
  }
};

const sellRole = async (name, message, client) => {
  const item = client.store.filter(i => i.name.toLowerCase().includes(name.toLowerCase()));
        
  if (!item) return message.channel.send("That item doesn't exist, Please make sure it is spelled correctly");
  if (!message.member.roles.has(item.array()[0].id)) return message.channel.send("You don't have the role :facepalm: ");
  
  const returnPrice = Math.floor(item.array()[0].price/2);
  
  const filter = m => m.author.id === message.author.id;
  const response = await client.awaitReply(message, `Are you sure you want to sell ${item.array()[0].name} for ₲${returnPrice.toLocaleString()}?`, filter, undefined, null);
  if (["y", "yes"].includes(response.toLowerCase())) {
  
    message.member.givePoints(returnPrice);
    await message.member.roles.remove(item.array()[0].id);
    message.channel.send("You have sold the role :tada: ");
  
  } else
  
  if (["n", "no", "cancel"].includes(response.toLowerCase())) {
    message.response(undefined, "Transaction cancelled.");
  }
};

class Store extends Social {
  constructor(client) {
    super(client, {
      name: "store",
      description: "Display All Store Items",
      usage: "store <-buy|-sell|-add|-del|-view>",
      category: "Social",
      aliases: []
    });
  }

  async run(message, args, level) { // eslint-disable-line no-unused-vars
    if (message.settings.socialSystem !== "true") return message.response(undefined, "The social system is disabled.");

    if (!args[0] && !message.flags.length) message.flags.push("view");
    if (!message.flags.length) {
      return message.reply(`|\`❌\`| ${this.help.usage}`);
    }
    // console.log(message.guild.store);
    switch (message.flags[0]) {
      case ("buy"): {
        const name = args.join(" ");
        if (!name) return message.reply(`|\`❌\`| ${this.help.usage}`);
        if (name.toLowerCase() === "slots") {
          buyToken(name, message, this.client);
        } else {
          buyRole(name, message, this.client);
        }
        break;
      }

      case ("sell"): {
        const name = args.join(" ");
        if (!name) return message.reply(`|\`❌\`| ${this.help.usage}`);
        if (name.toLowerCase() === "slots") {
          sellToken(name, message, this.client);
        } else {
          sellRole(name, message, this.client);
        }
        break;
      }

      case ("add"): {
        if (level < 3) return message.response(undefined, "B...Baka! You are too low level to add items to the shop");
        const price = args.pop();
        const name = args.join(" ");
        
        if (!name) return message.reply("Please add the exact name of the role");
        
        if (!message.guild.roles.find("name", name)) return message.reply("Please Enter The **Correct** Name Of The Role");
        
        if (this.client.store.has(name)) return message.reply("This role is already on sale");
        
        if (!price) return message.reply("Please specify a price");
        
        const role = { name: name.toLowerCase(), id: message.guild.roles.find("name", name).id.toString(), price: price, guildId: message.guild.id };
        this.client.store.set(role.id, role);
        message.reply(`${name} is now on sale `);
        break;
      }

      case ("del"): {
        if (level < 3) return message.response(undefined, "B...Baka! You are too low level to remove items from the shop");
        const name = args.join(" ");
        if (!name) return message.reply("Please specify the exact name of the role");
        const role = message.guild.roles.find("name", name);
        if (!this.client.store.has(role.id)) return message.reply("This role is not on sale");
        
        const filter = m => m.author.id === message.author.id;
        const response = await this.client.awaitReply(message, `Are you sure you want to remove ${name} from the shop?`, filter, undefined, null);
        if (["y", "yes"].includes(response)) {
        
          await this.client.store.delete(role.id);
          message.reply("The role is now off the store.");
        } else
        
        if (["n","no","cancel"].includes(response)) {
          message.reply("Action cancelled.");
        }
        break;
      }

      case ("view"): {
        const items = message.guild.store;
        if (items.length === 0) return  message.channel.send(`= ${message.guild.name} Store =\n` + "\n" + "= Tokens = \n" + `Slots${" ".repeat(20 - "Slots".length)}:: ₲${message.settings.tokenPrice} :: ${message.member.inventory["tokens"]} \n`, { code: "asciidoc" });
        message.channel.send(`= ${message.guild.name} Store =\n` + "\n" + "= Tokens = \n" + `Slots${" ".repeat(20 - "Slots".length)}:: ₲${message.settings.tokenPrice} :: ${message.member.inventory["tokens"]} \n \n`+ "= Roles For Sale = \n"+ items.map(item => 
          `${message.guild.roles.get(item.id.toString()).name}${" ".repeat(20 - message.guild.roles.get(item.id.toString()).name.length)}::  ${parseInt(item.price) === 0 ? "FREE" : `₲${parseInt(item.price).toLocaleString()}`} ${message.member.roles.has(item.id) ? ":: ✓" : ""}`).join("\n"), { code: "asciidoc" }
        );
      }
    }
  }
}
module.exports = Store;
