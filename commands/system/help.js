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
    type = type ? type.toLowerCase() : null;
    let embed;
    const embedPreset = {
      timestamp: new Date().getTime(),
      color: message.guild.me.roles.highest.color || 5198940,
      footer: {
        text: `Requested by ${message.author.tag}`,
        iconURL: message.author.avatarURL()
      }
    };
    const command = this.client.commands.get(type) || this.client.commands.find(c => c.conf.aliases && c.conf.aliases.includes(type));

    if (command) {
      const category = command.help.category.toLowerCase();
      const permLevel = this.client.levelCache[command.conf.permLevel];
      const prohibited = (category === "nsfw" && !message.channel.nsfw) || level < permLevel;

      if (prohibited) return;

      const name = command.help.name.toProperCase();
      const description = command.help.description;
      const extended = command.help.extended;
      const usage = command.help.usage;
      const aliases = command.conf.aliases;
      embed = new MessageEmbed(embedPreset)
        .setTitle(`${name} - ${description.length <= 75 ? description : `${description.slice(0, 75)}...`}`)
        .addField("Command details", extended, false)
        .addField("Command usage", `\`${usage}\``, false)
        .addField("Command aliases", !aliases.length ? "None" : aliases.join(", "), false);
      
      return message.channel.send({ embed });
    } else {
      const prefix = message.settings.prefix;
      const commandsPreset = this.client.commands
        .sort((p, c) => p.help.category > c.help.category ? 1 :  p.help.name > c.help.name && p.help.category === c.help.category ? 1 : -1 )
        .filter(c => {
          const category = c.help.category.toLowerCase();
          const permLevel = this.client.levelCache[c.conf.permLevel];

          return (!((category === "nsfw" && !message.channel.nsfw) || level < permLevel));
        });
      const isPage = type && !isNaN(type);
      const isDefault = !type || isPage;
      page = isPage ? parseInt(type) : page ? parseInt(page) : 1;
      embed = new PaginationEmbed(embedPreset)
        .setAuthorisedUser(message.author)
        .setChannel(message.channel)
        .setElementsPerPage(perpage)
        .showPageIndicator(true)
        .setTimeout(2 * 60 * 1000);

      if (isDefault) {
        let previousCategory;
        const description = `Use \`${prefix}help <category>\` to find commands for a specific category`;
        const tip = `\nTo skip to a page for more categories:\n\tReact with ↗; or\n\tDo \`${prefix}help [page-num]\``;
        const categories = Array.from(commandsPreset.values());
        const output = categories.map(c => {
          const beautifyCategory = c.help.category.toProperCase();
          const currentCategory = c.help.category.toLowerCase();

          if (currentCategory !== previousCategory) {
            previousCategory = currentCategory;

            return `\`${prefix}help ${currentCategory}\` | Shows ${beautifyCategory} commands`;
          }

          return null;
        }).filter(c => c);
        const pages = Math.ceil(output.length / perpage);

        embed
          .setTitle("Command category list")
          .setDescription([description, pages > 2 ? tip : ""])
          .setArray(output)
          .formatField("Categories", el => el);

        if (isPage) embed.setPage(page);
      } else {
        const filteredCommands = Array.from(commandsPreset.filter(c => c.help.category.toLowerCase() === type).values());
        const output = filteredCommands.map(c => {
          const help = c.help;
          const name = help.name;
          const description = help.description;
          
          return `\`${prefix}${name}\` | ${description.length <= 50 ? description : `${description.slice(0, 50)}...`}`;
        });
        const commandsLength = output.length;
        const pages = Math.ceil(commandsLength / perpage);

        if (commandsLength) {
          const description = `A list of commands in the ${type.toProperCase()} category.\n(Total of ${commandsLength} commands in this category)\n\nTo get help on a specific command do \`${prefix}help <command>\``;
          const tip = `\nTo skip to a page for more commands:\n\tReact with ↗; or\n\tDo \`${prefix}help ${type} [page-num]\``;

          embed
            .setTitle("Command category help")
            .setDescription([description, pages > 2 ? tip : ""])
            .setArray(output)
            .setPage(page)
            .formatField("Commands", el => el);
        }
      }

      if (!embed.array || !embed.array.length) return;

      return embed.build();
    }
  }
}

module.exports = Help;
