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
    page = page ? parseInt(page) : 1;

    const embed = new MessageEmbed()
      .setTimestamp()
      .setColor(message.guild.me.roles.highest.color || 5198940)
      .setFooter(`Requested by ${message.author.tag}`, message.author.avatarURL()); 

    let currentCategory = "";
    const sorted = this.client.commands.sort((p, c) => p.category > c.category ? 1 :  p.name > c.name && p.category === c.category ? 1 : -1 );
    if (!type) {
      const description = `Command category list\n\nUse \`${message.settings.prefix}help <category>\` to find commands for a specific category`;
      const output = sorted.filter(c => !(level < 10 && c.category == "Owner") || !(c.category === "NSFW" && !message.channel.nsfw)).map(c => {
        const cat = c.category.toProperCase();
        if (currentCategory !== cat && !type) {
          currentCategory = cat;
          return `\n\`${message.settings.prefix}help ${cat.toLowerCase()}\` | Shows ${cat} commands`;
        }
      }).join("");

      embed.setDescription(description).addField("Categories", output);
    } else {
      let n = 0;
      let output = "";
      let num = 0;
      for (const c of sorted.values()) if (c.category.toLowerCase() === type.toLowerCase()) n++;

      const pg = page && page <= Math.ceil(n / perpage) ? page : 1;
      for (const c of sorted.values()) {
        if (c.category.toLowerCase() === type.toLowerCase()) {
          if (c.category === "Owner" && level < 10) return;
          if (c.category === "NSFW" && !message.channel.nsfw) return;
          if (num < perpage * pg && num > perpage * pg - (perpage + 1)) {
            if (level < this.client.levelCache[c.conf.permLevel]) return;
            output += `\n\`${message.settings.prefix + c.name}\` | ${c.description.length > 50 ? `${c.description.slice(0,50)}...` : c.description}`;
          }
          num++;
        }
      }
    
      if (num) {
        embed.setTitle("Command category help")
          .setDescription(`A list of commands in the ${type} category.
(Total of ${num} commands in this category)

To get help on a specific command do \`${message.settings.prefix}help <command>\`

${num > 10 && pg === 1 ? `To view more commands do\` ${message.settings.prefix}help <category> 2\`` : "" }`)
          .addField("Commands", output);
      }
    }

    if (this.client.commands.has(type)) {
      const cm = this.client.commands.get(type);
      if (level < this.client.levelCache[cm.conf.permLevel]) return;
      embed.setTitle(cm.help.name.toProperCase())
        .addField("Command description", cm.description)
        .addField("Command usage", `\`${cm.usage}\``)
        .addField("Command aliases", !cm.aliases.length ? "None" : cm.aliases.join(", "));
    }
    
    if (!embed.fields[0]) return;

    return message.channel.send(embed);
  }
}

module.exports = Help;