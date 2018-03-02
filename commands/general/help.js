const Command = require(`${process.cwd()}/base/Command.js`);
const { MessageEmbed } = require("discord.js");
const perpage = 10;

class Help extends Command {
  constructor(client) {
    super(client, {
      name: "help",
      description: "Get help on a command, command category, or a setting",
      extended: "This command will display all available commands for your permission level, with the additonal option of getting per command information when you run 'help <command name>'.",
      category: "System",
      usage: "help <category/command/setting> [page-num]",
      aliases: ["h", "halp", "commands"]
    });
  }

  async run(message, [type, page], level) {

    if (type) type = type.toLowerCase();
    if (page) page = parseInt(page);

    const embed = new MessageEmbed()
      .setTimestamp()
      .setColor(message.guild.me.roles.highest.color || 5198940)
      .setFooter(`Requested by ${message.author.tag}`, message.author.avatarURL()); 

    let currentCategory = "";
    const sorted = this.client.commands.sort((p, c) => p.help.category > c.help.category ? 1 :  p.help.name > c.help.name && p.help.category === c.help.category ? 1 : -1 );
    
    if (!type) {
      const description = `Command category list\n\nUse \`${message.settings.prefix}help <category>\` to find commands for a specific category`;
      const output = sorted.filter(c => !(level < 10 && c.help.category === "Owner") || !(c.help.category === "NSFW" && !message.channel.nsfw)).map(c => {
        const cat = c.help.category.toProperCase();
        if (currentCategory !== cat && !type) {
          currentCategory = cat;
          return `\n\`${message.settings.prefix}help ${cat.toLowerCase()}\` | Shows ${cat} commands`;
        }
      }).join("");
      embed.setDescription(description)
        .addField("Categories", output);

    } else {
      if (this.client.commands.has(type) || this.client.aliases.has(type)) {
        const cm = this.client.commands.get(type) || this.client.commands.get(this.client.aliases.get(type));
        if (level < this.client.levelCache[cm.conf.permLevel]) return;
        embed.setTitle(cm.help.name.toProperCase())
          .addField("Command description", cm.help.description)
          .addField("Command usage", `\`${cm.help.usage}\``)
          .addField("Command aliases", cm.conf.aliases.length === 0 ? "None" : cm.conf.aliases.join(", ") );

      } else {
        let n = 0;
        sorted.forEach(c => {
          c.help.category.toLowerCase() === type ? n++ : n;
        });
    
        let output = "";
        let num = 0;
        const pg = page && page <= Math.ceil(n / perpage) ? page : 1;
        for (const c of sorted.values()) {
          if (c.help.category.toLowerCase() === type) {
            if (num < perpage * pg && num > perpage * pg - (perpage + 1)) {
              if (level < this.client.levelCache[c.conf.permLevel]) continue;
              if (c.help.category === "NSFW" && !message.channel.nsfw && level < 10) continue;
              output += `\n\`${message.settings.prefix + c.help.name}\` | ${c.help.description.length > 50 ? c.help.description.slice(0,50) +"...": c.help.description}`;
            }
            num++;
          }
        }
    
        if (!num) return;
        embed.setTitle("Command category help")
          .setDescription(`A list of commands in the ${type} category.\n(Total of ${num} commands in this category)\n\nTo get help on a specific command do \`${message.settings.prefix}help <command>\`\n\n${num > 10 && pg === 1 ? `To view more commands do\` ${message.settings.prefix}help <category> 2\`` : "" }`)
          .addField("Commands", output);
      
      }
    }
    return message.channel.send(embed);
  }
}

module.exports = Help;