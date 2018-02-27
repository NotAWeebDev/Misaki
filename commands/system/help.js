const Command = require(`${process.cwd()}/base/Command.js`);
const { MessageEmbed } = require("discord.js");
const PaginationEmbed = require(`${process.cwd()}/util/PaginationEmbed`);
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

    let embed;
    const embedPreset = {
      timestamp: new Date().getTime(),
      color: message.guild.me.roles.highest.color || 5198940,
      footer: {
        text: `Requested by ${message.author.tag}`,
        iconURL: message.author.avatarURL()
      }
    };

    if (this.client.commands.has(type) || this.client.commands.some(command => command.conf.aliases.includes(type))) {
      const cm = this.client.commands.get(type) || this.client.commands.get(this.client.aliases.get(type));
      if (level < this.client.levelCache[cm.conf.permLevel]) return;
      embed = new MessageEmbed(embedPreset)
        .setTitle(cm.help.name.toProperCase())
        .addField("Command description", cm.help.description, false)
        .addField("Command usage", `\`${cm.help.usage}\``, false)
        .addField("Command aliases", cm.conf.aliases.length == 0 ? "None" : cm.conf.aliases.join(", "), false);
      
      return message.channel.send({ embed });
    } else {
      let currentCategory = "";
      const sorted = this.client.commands.sort((p, c) => p.help.category > c.help.category ? 1 :  p.help.name > c.help.name && p.help.category === c.help.category ? 1 : -1 );
      embed = new PaginationEmbed(embedPreset)
        .setAuthorisedUser(message.author)
        .setChannel(message.channel)
        .setElementsPerPage(perpage)
        .showPageIndicator(true)
        .setTimeout(60 * 1000);

      if (!type) {
        const title = "Command category list";
        const description = `Use \`${message.settings.prefix}help <category>\` to find commands for a specific category`;
        const categories = sorted.filter(c => !(level < 10 && c.help.category == "Owner") || !(c.help.category === "NSFW" && !message.channel.nsfw)).map(c => {
          const cat = c.help.category.toProperCase();
          if (currentCategory !== cat && !type) {
            currentCategory = cat;
            return `\`${message.settings.prefix}help ${cat.toLowerCase()}\` | Shows ${cat} commands`;
          }
        });
        const output = [];
        
        for (let i = 0; i < categories.length; i++) {
          if (categories[i] === undefined) continue;
          output.push(categories[i]);
        }

        embed
          .setTitle(title)
          .setDescription(description)
          .setArray(output)
          .formatField("Categories", el => el);
      } else {
        let n = 0;
        sorted.forEach(c => {
          if (c.help.category.toLowerCase() === type.toLowerCase()) {
            n++;
          }
        });
      
        const output = [];
        let num = 0;
        const pg = parseInt(page) && parseInt(page) <= Math.ceil(n / perpage) ? parseInt(page) : 1;
        for (const c of sorted.values()) {
          if (c.help.category.toLowerCase() === type.toLowerCase()) {
            if (c.help.category === "Owner" && level < 10 ) return;
            if (c.help.category === "NSFW" && !message.channel.nsfw) return;
            if (level < this.client.levelCache[c.conf.permLevel]) return;
            output.push(`\`${message.settings.prefix + c.help.name}\` | ${c.help.description.length > 50 ? c.help.description.slice(0,50) +"...": c.help.description}`);
            num++;
          }
        }
      
        if (num) {
          embed
            .setTitle("Command category help")
            .setDescription(`A list of commands in the ${type} category.\n(Total of ${num} commands in this category)\n\nTo get help on a specific command do \`${message.settings.prefix}help <command>\`${num > perpage && pg === 1 ? "\n\nTo skip to a page for more commands react with ↗" : "" }`)
            .setArray(output)
            .setPage(pg)
            .formatField("Commands", el => el);
        }
      }

      return await embed.build();
    }
  }
}

module.exports = Help;