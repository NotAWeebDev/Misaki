const Social = require("../../structures/Social.js");

class Leaderboard extends Social {
  constructor(...args) {
    super(...args, {
      name: "leaderboard",
      description: "Displays the top 10 active users.",
      usage: "leaderboard",
      category: "Social",
      cost: 0,
      cooldown: 10,
      aliases: ["top10", "top", "leader", "lb"]
    });
  }

  async run(message, args, level) { // eslint-disable-line no-unused-vars
    if (message.settings.socialSystem !== "true") return message.response(undefined, "The social system is disabled.");
    const leaderboard = [];
    const lbServer = [];

    const list = this.client.points.filter(p => p.guild === message.guild.id && message.guild.members.get(p.user) && p.points > 0);

    // page doing    
    let page = parseInt(args[0]) ? parseInt(args[0]) : 1;
    const totalPages = Math.round(list.size / 10);
    if (totalPages === 0) return message.channel.send("There is no leaderboard in the server, maybe its a dead place???");
    page -= 1;
    if (page > totalPages && !totalPages) return message.channel.send(`There are only **${totalPages || 1}** pages in the leaderboard.`);
    if (totalPages && page + 1 > totalPages) return message.channel.send(`There are only **${totalPages || 1}** pages in the leaderboard.`);
     
    // getting user's position
    list.map(p => ({points: p.points, user: p.user}))
      .sort((a, b) => b.points > a.points ? 1 : -1)
      .map(us => {
        lbServer.push(us.user);
      });
      
    // top-10 thing
    list.map(p => ({points: p.points, user: p.user}))
      .sort((a, b) => b.points > a.points ? 1 : -1).slice(page*10, (page+1)*10)
      .map((u, i) => {
        leaderboard.push(`${(page*10 + (i + 1)).toString().padStart(2, "0")} ❯ ${this.client.users.get(u.user).tag}${" ".repeat(40 - this.client.users.get(u.user).tag.length)}::  ${u.points.toLocaleString()}`);
      });
    leaderboard.push("-------------------------------------------------------------");
      
    const pos = lbServer.indexOf(message.author.id).toString().padStart(2, "0");
    const posTxt = pos == -1 ? "??" : (lbServer.indexOf(message.author.id) + 1).toString().padStart(2, "0");
    leaderboard.push(`${posTxt} ❯ ${message.author.tag}${" ".repeat(40 - message.author.tag.length)}::  ${this.client.points.get(`${message.guild.id}-${message.author.id}`).points.toLocaleString()}`);
    return message.channel.send(`**__${message.guild.name}__**'s Leaderboard (Page **${page+1}** out of **${totalPages || 1}**)\n\`\`\`${leaderboard.join("\n")}\`\`\``);
  }
}

module.exports = Leaderboard;
