const { Permissions } = require("discord.js");
const pageButtons = ["⬅","➡","🛑"];

class Command {
  constructor(client, file, options = {}) {
    this.client = client;
    this.name = options.name || file.name;
    this.aliases = options.aliases || [];
    this.description = options.description || "No description provided.";
    this.category = options.category || "General";
    this.usage = options.usage || "No usage provided.";
    this.extended = options.extended || "No information provided.";
    this.cost = options.cost || 0;
    this.cooldown = "cooldown" in options ? options.cooldown : 0;
    this.hidden = options.hidden || false;
    this.guildOnly = options.guildOnly || false;
    this.botPerms = new Permissions(options.botPerms || []).freeze();
    this.permLevel = options.permLevel || "User";
    this.file = file;
    this.store = this.client.commands;
  }

  async paginate(message, list, makeEmbed) {
    const msg = await message.channel.send("`Loading please wait ...`");
    for (let i = 0; i < pageButtons.length; i++) await msg.react(pageButtons[i]);
    const embed = await msg.edit({ embed: this.makeEmbed(list, 0) });
    return this.progressPages(message, embed, list, 0, makeEmbed);
  }
  
  progressPages(message, embed, list, page, embedMakerFunction) {
    return embed.awaitReactions((rec, user) => user.id === message.author.id && pageButtons.includes(rec.emoji.toString()), { time: 30000, max: 1, errors: ["time"] })
      .then((reactions) => {
        const res = reactions.first();
        switch (res._emoji.name) {
          case "⬅":
            page -= 1;
            break;
          case "➡":
            page += 1;
            break;
          case "🛑":
            return embed.reactions.removeAll();
        }
        page = page <= 0 ? 0 : page >= list.length  ? list.length - 1 : page;      
        embed.edit(embedMakerFunction(list, page));
        res.users.remove(message.author);
        return this.progressPages(message, embed, list, page, embedMakerFunction);
      })
      .catch((error) => {
        this.client.console.error(error);
        return message.channel.send("There was some error, sorry for the interuption.").then(sent => sent.delete({ timeout : 5000 }));
      });
  }

  async verifyUser(message, user, options = {}) {
    let member;
    const idMatch = /(?:<@!?)?([0-9]{17,20})>?/gi.exec(user);
    if (idMatch) return this.client.users.fetch(idMatch[1]);
    if (/(#[0-9]{4})$/.test(user)) member = message.guild.members.find(member => member.user.tag === user);
    else member = message.guild.members.find(member => member.user.username === user);
    if (member) return member.user;
    throw new this.client.methods.errors.ParseError("Invalid Mention or ID", options.msg);
  }

  async verifyMember(message, member, options = {}) {
    const user = await this.verifyUser(message, member, options);
    return message.guild.members.fetch(user);
  }

  verifyMessage(message, msgid, options = {}) {
    const match = /([0-9]{17,20})/.exec(msgid);
    if (!match) throw new this.client.methods.errors.ParseError("Invalid Message ID.", options.msg);
    const id = match[1];
    return message.channel.messages.fetch(id).then(msg => msg.id);
  }

  async verifyChannel(message, chanid, options = {}) {
    const match = /([0-9]{17,20})/.exec(chanid);
    if (!match) return message.channel.id;
    const id = match[1];
    const check = message.guild.channels.get(id);
    if (!check || check.type !== "text") throw new this.client.methods.errors.ParseError("No Channel found or wrong type", options.msg);
    return check.id;
  }

  async run(message, args, level) { // eslint-disable-line no-unused-vars
    throw new Error(`Command ${this.constructor.name} doesn't provide a run method.`);
  }

  reload() {
    return this.store.load(this.file.path);
  }

}
module.exports = Command;
