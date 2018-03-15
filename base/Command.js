const { ParseError } = require("../util/CustomError.js");
const pageButtons = ["⬅","➡","🛑"];

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
    guildOnly = true,
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

  async paginate(message, list, makeEmbed) {
    const msg = await message.channel.send("`Loading please wait ...`");
    for (let i = 0; i < pageButtons.length; i++) { await msg.react(pageButtons[i]); }
    const embed = await msg.edit("", { embed: (this.makeEmbed(list, 0)) });

    return await this.progressPages(message, embed, list, 0, makeEmbed);
  }
  
  progressPages(message, embed, list, page, embedMakerFunction) {
    embed.awaitReactions((rec, user) => user.id === message.author.id && pageButtons.includes(rec.emoji.toString()), { time: 30000, max: 1, errors: ["time"] })
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
        this.client.logger.error(error);
        return message.channel.send("There was some error, sorry for the interuption.").then(sent => sent.delete({ timeout : 5000 }));
      });
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
    let member;
    const idMatch = /(?:<@!?)?([0-9]{17,20})>?/gi.exec(user);
    if (idMatch) return this.client.users.fetch(idMatch[1]);
    if (/(#[0-9]{4})$/.test(user)) member = message.guild.members.find(member => member.user.tag === user);
    else member = message.guild.members.find(member => member.user.username === user);
    if (member) return member.user;
    throw new ParseError("Invalid Mention or ID", options.msg);
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
