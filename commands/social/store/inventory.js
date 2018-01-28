const Social = require(`${process.cwd()}/base/Social.js`);
class Item extends Social {
  constructor(client) {
    super(client, {
      name: "inventory",
      description: "Displays, adds, and removes from inventories.",
      usage: "inventory [-<give|take> <mention|userid> <amount> <name>]",
      aliases: ["inv"],
      hidden: true
    });
  }

  async run(message, [member, amount, name], level) {
    if (message.settings.socialSystem !== "true") return message.response(undefined, "The social system is disabled.");
    if (message.settings.socialInventory !== "true") return message.response(undefined, "The inventory system is disabled.");
    if (!message.flags.length) message.flags.push("view");
    try {
      const [bot, user] = await this.verifySocialUser(message, member || message.member);
      if (bot) return message.response("❗", "Bot's do not have an inventory.");
      const _member = message.guild.members.get(user.id);
      switch (message.flags[0]) {
        case ("give"):
          if (level < 2) return message.response(undefined, "B...Baka! You are too low level to add items to inventories");
          if (_member.inventory[name] === undefined) return message.response(undefined, `Invalid item ${name}`);
          if (isNaN(parseInt(amount))) return message.response(undefined, `B...Baka! ${amount} isn't even a number!`);
          if (parseInt(amount) < 1) return message.response(undefined, "B...Baka! You can't give them nothing!");
          _member.giveItem(name, amount);
          message.channel.send(`Successfully gave ${_member.displayName} ${amount} ${name}, enjoy!`);
          break;
        case ("take"):
          if (level < 2) return message.response(undefined, "B...Baka! You are too low level to take items from inventories");
          if (_member.inventory[name] === undefined) return message.response(undefined, `Invalid item ${name}`);
          if (isNaN(parseInt(amount))) return message.response(undefined, `B...Baka! ${amount} isn't even a number!`);
          if (parseInt(amount) < 1) return message.response(undefined, "B...Baka! You can't take nothing from them!");
          _member.takeItem(name, amount);
          message.channel.send(`Successfully took ${amount} ${name} from ${_member.displayName}, enjoy!`);
          break;
      
        case ("view"):
          message.channel.send(`= ${message.member.displayName}'s Inventory =\n` + `Keys${" ".repeat(20 - "Keys".length)}::  ${message.member.inventory["keys"]}
Crates${" ".repeat(20 - "Crates".length)}::  ${message.member.inventory["crates"]}
Tokens${" ".repeat(20 - "Tokens".length)}::  ${message.member.inventory["tokens"]}` , { code: "asciidoc" });
  
          break;
      }
    } catch (e) {
      console.log(e);
    }
  }
}

module.exports = Item;
