const Owner = require("../../structures/Owner.js");

class Blacklist extends Owner {
  constructor(...args) {
    super(...args, {
      name: "blacklist",
      description: "Adds a user to the blacklist.",
      category: "Creator",
      usage: "blacklist <mention>",
      aliases: ["bl"],
      permLevel: "Creator"
    });
  }

  async run(message, args, level) { // eslint-disable-line no-unused-vars
    if (!args[0] && !message.flags.length) message.flags.push("list");

    const blacklist = this.client.blacklist.get("list");

    switch (message.flags[0]) {
      case "add": {
        const author = message.mentions.users.first() || await this.client.users.fetch(args[0]);
        const member = message.guild.member(author);
        if (!author) return message.channel.send("You must supply a user id or mention to blacklist them.");
        if (blacklist.includes(author.id)) return message.reply("That user is already blacklisted.");
        if (message.author.id === author.id) return message.reply("You cannot blacklist yourself. ~~idiot~~");
        const msg = { author, member, guild: message.guild, client: this.client, channel: message.channel };
        if (level <= this.client.permlevel(msg)) return message.reply("You cannot black list someone of equal, or a higher permission level.");
        blacklist.push(author.id);
        this.client.blacklist.set("list", blacklist);
        await message.channel.send("User successfully added to blacklist.");
        break;
      }

      case "remove": {
        const author = message.mentions.users.first() || await this.client.users.fetch(args[0]);
        if (!author) return message.channel.send("You must supply a user id or mention to blacklist them.");
        if (!blacklist.includes(author.id)) return message.reply("That user is not blacklisted.");
        blacklist.remove(author.id);
        this.client.blacklist.set("list", blacklist);
        message.channel.send("User successfully removed from blacklist.");
        break;
      }

      case "view":
      case "list": {
        if (blacklist.length < 1) return message.channel.send("No one is blacklisted.");
        const a = blacklist;
        const fetch = Promise.all(a.map(r => this.client.users.fetch(r).then(u => `${u.tag} (${u.id})`)));
        fetch.then(r => message.channel.send(`**❯ Blacklisted:**\n${r.join("\n")}`)).catch(error => console.log(error));
        break;
      }
    }
  }

}

module.exports = Blacklist;
