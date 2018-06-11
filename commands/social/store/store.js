const Social = require("../../../structures/Social.js");

class Store extends Social {
  constructor(...args) {
    super(...args, {
      name: "store",
      description: "Display All Store Items",
      usage: "store <-buy|-sell|-add|-del|-view>",
      category: "Social"
    });
  }

  async run(message, args, level) {
    if (message.settings.socialSystem !== "true") return message.response(undefined, "The social system is disabled.");

    if (!args[0] && !message.flags.length) message.flags.push("view");
    if (!message.flags.length) return message.reply(`|\`❌\`| ${this.usage}`);

    switch (message.flags[0]) {
      case "buy": {
        const name = args.join(" ");
        if (!name) return message.reply(`|\`❌\`| ${this.usage}`);
        if (name.toLowerCase() === "slots") await this.buyToken(name, message);
        else await this.buyRole(name, message);
        break;
      }
      case "sell": {
        const name = args.join(" ");
        if (!name) return message.reply(`|\`❌\`| ${this.usage}`);
        if (name.toLowerCase() === "slots") await this.sellToken(name, message);
        else await this.sellRole(name, message);
        break;
      }
      case "add": {
        if (level < 3) return message.response(undefined, "B...Baka! You are too low level to add items to the shop");
        const price = args.pop();
        const name = args.join(" ");
        if (!name) return message.reply("Please add the exact name of the role");
        if (!message.guild.roles.find("name", name)) return message.reply("Please Enter The **Correct** Name Of The Role");
        if (this.client.store.has(name)) return message.reply("This role is already on sale");
        if (!price) return message.reply("Please specify a price");
        const role = { name: name.toLowerCase(), id: message.guild.roles.find("name", name).id, price: price, guildId: message.guild.id };
        this.client.store.set(role.id, role);
        message.reply(`${name} is now on sale`);
        break;
      }

      case "del": {
        if (level < 3) return message.response(undefined, "B...Baka! You are too low level to remove items from the shop");
        const name = args.join(" ");
        if (!name) return message.reply("Please specify the exact name of the role");
        const role = message.guild.roles.find("name", name);
        if (!this.client.store.has(role.id)) return message.reply("This role is not on sale");
        
        const filter = m => m.author.id === message.author.id;
        const response = await message.awaitReply(`Are you sure you want to remove ${name} from the shop?`, filter, undefined, null);
        if (["y", "yes"].includes(response)) {
          await this.client.store.delete(role.id);
          message.reply("The role is now off the store.");
        } else if (["n","no","cancel"].includes(response)) {
          message.reply("Action cancelled.");
        }
        break;
      }
      case "view": {
        const items = message.guild.store;
        if (!items.length) return  message.channel.send(`= ${message.guild.name} Store =\n\n` + "\n" + "= Tokens = \n" + `Slots${" ".repeat(20 - "Slots".length)}:: ₲${message.settings.tokenPrice} :: ${message.member.inventory.tokens} \n`, { code: "asciidoc" });
        message.channel.send(`= ${message.guild.name} Store =\n` + "\n" + "= Tokens = \n" + `Slots${" ".repeat(20 - "Slots".length)}:: ₲${message.settings.tokenPrice} :: ${message.member.inventory.tokens} \n \n`+ "= Roles For Sale = \n"+ items.map(item => 
          `${message.guild.roles.get(item.id).name}${" ".repeat(20 - message.guild.roles.get(item.id).name.length)}::  ${Number(item.price) === 0 ? "FREE" : `₲${Number(item.price).toLocaleString()}`} ${message.member.roles.has(item.id) ? ":: ✓" : ""}`).join("\n"), { code: "asciidoc" }
        );
      }
    }
  }

  async buyToken(name, message) {
    const tokenPrice = Number(message.settings.tokenPrice);
    const userPoints = Number(message.member.score.points);
    if (tokenPrice > userPoints) {
      return message.channel.send(`You currently have ₲${userPoints.toLocaleString()}, but the token costs ${tokenPrice.toLocaleString()}!`);
    }
    const filter = m => m.author.id === message.author.id;
    const number = await message.awaitReply("How many tokens do you want to buy ?", filter, undefined, null);
    const response = await message.awaitReply(`Are you sure you want to purchase ${number == 1 ? "a" : number} Slot Token${number == 1 ? "" : "s"} for ₲${message.settings.tokenPrice * number}?`, filter, undefined, null);
    if (["y", "yes"].includes(response.toLowerCase())) {
      message.member.takePoints(tokenPrice * number);
      await message.member.giveItem("tokens", Number(number));
      message.channel.send("You have bought a token");
    } else if (["n", "no", "cancel"].includes(response.toLowerCase())) {
      message.response(undefined, "Transaction cancelled.");
    }
  }

  async buyRole(name, message) {
    const item = this.client.store.filter(i => i.name.toLowerCase().includes(name.toLowerCase()));
    if (item.size > 1) return message.reply(`B..Baka! Be more specific more than that, there is more than one item on sale with ${name} as their name`);
    if (!item) return message.channel.send("That item doesn't exist, Please make sure it is spelled correctly");
    if (message.member.roles.has(item.array()[0].id)) return message.channel.send("You already have the role :facepalm: ");
    
    const userPoints = Number(message.member.score.points);
    const rolePrice = Number(item.array()[0].price);
    
    if (userPoints < rolePrice) {
      return message.channel.send(`You currently have ₲${userPoints.toLocaleString()}, but the role costs ${rolePrice.toLocaleString()}!`);
    }
  
    const filter = m => m.author.id === message.author.id;
    const firstItem = item.array()[0];
    const response = await message.awaitReply(`Are you sure you want to purchase ${firstItem.name} for ₲${firstItem.price.toLocaleString()}?`, filter, undefined, null);
    if (["y", "yes"].includes(response.toLowerCase())) {
    
      message.member.takePoints(rolePrice);
      await message.member.roles.add(item.array()[0].id);
      message.channel.send("You have bought the role :tada: ");
    
    } else
    
    if (["n", "no", "cancel"].includes(response.toLowerCase())) {
      message.response(undefined, "Transaction cancelled.");
    }
  }

  async sellToken(name, message) {
    const tokenPrice = Number(message.settings.tokenPrice);
    const returnPrice = tokenPrice / 2;
    const filter = m => m.author.id === message.author.id;
    const response = await message.awaitReply(`Are you sure you want to sell a Token for ₲${returnPrice}?`, filter, undefined, null);
    if (["y", "yes"].includes(response.toLowerCase())) {

      message.member.takePoints(returnPrice);
      message.member.takeItem("tokens", 1);
      message.channel.send("You have sold a token");

    } else
    
    if (["n", "no", "cancel"].includes(response.toLowerCase())) {
      message.response(undefined, "Transaction cancelled.");
    }
  }
  
  async sellRole(name, message) {
    const item = this.client.store.filter(i => i.name.toLowerCase().includes(name.toLowerCase()));
          
    if (!item) return message.channel.send("That item doesn't exist, Please make sure it is spelled correctly");
    if (!message.member.roles.has(item.array()[0].id)) return message.channel.send("You don't have the role :facepalm: ");
    
    const returnPrice = Math.floor(item.array()[0].price/2);
    
    const filter = m => m.author.id === message.author.id;
    const response = await message.awaitReply(`Are you sure you want to sell ${item.array()[0].name} for ₲${returnPrice.toLocaleString()}?`, filter, undefined, null);
    if (["y", "yes"].includes(response.toLowerCase())) {
      message.member.givePoints(returnPrice);
      await message.member.roles.remove(item.array()[0].id);
      message.channel.send("You have sold the role :tada: ");
    } else if (["n", "no", "cancel"].includes(response.toLowerCase())) {
      message.response(undefined, "Transaction cancelled.");
    }
  }
  
}
module.exports = Store;
