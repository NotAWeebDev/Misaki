const { ParseError } = require("../util/CustomError.js");

class Command {
  constructor(client, {
    name = null,
    description = "No description provided.",
    category = "General",
    usage = "No usage provided.",
    extended = "No information provided.",
    cost = 0,
    cooldown = 0,
    hidden = false,
    guildOnly = false,
    aliases = [],
    botPerms = [],
    permLevel = "User",
    location = ""
  }) {
    this.client = client;
    this.conf = {
      hidden,
      guildOnly,
      aliases,
      botPerms,
      permLevel,
      location,
      cooldown
    };
    this.help = {
      name,
      description,
      category,
      usage,
      extended,
      cost
    };
  }

  makeTitles(data) {
    const arr = new Array();
    const { makeTitle } = this;
    for (let i = 0; i <5; i++) {
      arr.push(`\n${i + 1}:`);
      arr.push(makeTitle(i, data));
    }
    return arr.join(" ");
  }

  makeTitle(index, data) {
    const line1 = data[index].titles.en_jp ? data[index].titles.en_jp : "";
    const line2 = data[index].titles.en ? `/${data[index].titles.en}` : "";
    return `${line1}${line2}`;
  }

  async verifyUser(message, user, options = {}) {
    const match = /(?:<@!?)?([0-9]{17,20})>?/gi.exec(user);
    if (!match) throw new ParseError("Invalid Mention or ID", options.msg);
    const id = match[1];
    return this.client.users.fetch(id);
  }

  async verifyMember(message, member, options = {}) {
    const user = await this.verifyUser(message, member, options.msg);
    const target = await message.guild.members.fetch(user);
    return target;
  }

  async verifyMessage(message, msgid, options = {}) {
    const match = /([0-9]{17,20})/.exec(msgid);
    if (!match) throw new ParseError("Invalid Message ID.", options.msg);
    const id = match[1];
    return message.channel.messages.fetch(id).then(m => m.id);
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
