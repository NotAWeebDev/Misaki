const { ParseError } = require("../util/CustomError.js");
const { Permissions } = require("discord.js");

class Command {
  constructor(client, options) {

    this.client = client;
    this.name = options.name || null;
    this.aliases = options.aliases || [];
    this.description = options.description || "No description provided.";
    this.category = options.category || "General";
    this.usage = options.usage || "No usage provided.";
    this.extended = options.extended || "No information provided.";
    this.cost = options.cost || 0;
    this.cooldown = options.cooldown || 0;
    this.hidden = options.hidden || false;
    this.guildOnly = options.guildOnly || false;
    this.botPerms = new Permissions(options.botPerms || []).freeze();
    this.permLevel = options.permLevel || "User";
    this.location = "";
  }

  makeTitles(data) {
    const arr = [];
    for (let i = 0; i < 5; i++) arr.push(`\n${i + 1}: ${this.makeTitle(i, data)}`);
    return arr.join(" ");
  }

  makeTitle(index, data) {
    const line1 = data[index].titles.en_jp ? data[index].titles.en_jp : "";
    const line2 = data[index].titles.en ? `/${data[index].titles.en}` : "";
    return `${line1}${line2}`;
  }

  verifyUser(message, user, options = {}) {
    const match = /(?:<@!?)?([0-9]{17,20})>?/gi.exec(user);
    if (!match) throw new ParseError("Invalid Mention or ID", options.msg);
    const id = match[1];
    return this.client.users.fetch(id);
  }

  async verifyMember(message, member, options = {}) {
    const user = await this.verifyUser(message, member, options);
    return message.guild.members.fetch(user);
  }

  async verifyMessage(message, msgid, options = {}) {
    const match = /([0-9]{17,20})/.exec(msgid);
    if (!match) throw new ParseError("Invalid Message ID.", options.msg);
    const id = match[1];
    return message.channel.messages.fetch(id).then(msg => msg.id);
  }

  async verifyChannel(message, chanid, options = {}) {
    const match = /([0-9]{17,20})/.exec(chanid);
    if (!match) return message.channel.id;
    const id = match[1];
    const check = message.guild.channels.get(id);
    if (!check || check.type !== "text") throw new ParseError("No Channel found or wrong type", options.msg);
    return check.id;
  }

  async run(message, args, level) { // eslint-disable-line no-unused-vars
    throw new Error(`Command ${this.constructor.name} doesn't provide a run method.`);
  }

}
module.exports = Command;
