const Command = require(`${process.cwd()}/base/Command.js`);
const {MessageEmbed} = require("discord.js");
const perpage = 10;
/*
  The HELP command is used to display every command's name and description
  to the user, so that he may see what commands are available. The help
  command is also filtered by level, so if a user does not have access to
  a command, it is not shown to them. If a command name is given with the
  help command, its extended help is shown.
*/
class Help extends Command {
  constructor(client) {
    super(client, {
      name: "help",
      description: "Get help on a command, command category, or a setting",
      category: "Utility",
      enabled:true,
      guildOnly:false,
      usage: "help <category/command/setting> [page-num]",
      aliases: ["halp","h"],
      permLevel: "User",
      examples:["moderation","mute"]
    });
  }

  async run(message, args, level) {
  // If no specific command is called, show all filtered commands.
    const client = this.client;
    const embed = new MessageEmbed();
    // Load guild settings (for prefixes and eventually per-guild tweaks)
    const settings = message.guild ? await this.client.settings.get(message.guild.id) : this.client.config.defaultSettings;
    // Filter all commands by which are available for the user's level, using the <Collection>.filter() method.
    
    const myCommands = this.client.commands.filter(function(cmd) {return cmd.help.category != "Staff";});
    
    //myCommands = message.guild ? client.commands.filter(cmd => client.levelCache[cmd.conf.permLevel] <= level) : client.commands.filter(cmd => client.levelCache[cmd.conf.permLevel] <= level &&  cmd.conf.guildOnly !== true);
    
    // Here we have to get the command names only, and we use that array to get the longest name.
    // This make the help commands "aligned" in the output.
    
    let currentCategory = "";
    const sorted = myCommands.array().sort((p, c) => p.help.category > c.help.category ? 1 :  p.help.name > c.help.name && p.help.category === c.help.category ? 1 : -1 );
    if (!args[0]) {
      const description = `Command category list\n\nUse \`${settings.prefix}help <category>\` to find commands for a specific category`;
      let output = "";
      sorted.forEach( c => {
        const cat = c.help.category.toProperCase();
    
        if (currentCategory !== cat && !args[0]) {
          output += `\`${settings.prefix}help ${cat.toLowerCase()}\` | Shows ${cat} commands\n`;
          currentCategory = cat;
        }
        //output += `${settings.prefix.value}${c.help.name}${" ".repeat(longest - c.help.name.length)} :: ${c.help.description}\n`;
      });
      embed.setTitle("Misaki Help")
        .setDescription(description)
        .setAuthor(message.author.tag, message.author.avatarURL())
        .addField("Categories", output)
        .setTimestamp()
        .setColor(message.guild.me.roles.highest.color || 0x00AE86)
        .setFooter("Misaki", this.client.user.avatarURL()); 
      message.channel.send({embed});

    } else {
      let lol = 0;
      sorted.forEach(c => {
        if (c.help.category.toLowerCase() == args[0]) {
          lol = lol + 1;
        }
      });
    
      let output = "";
      let num = 0;
      const page = parseInt(args[1]) > 0 && parseInt(args[1]) <= Math.ceil(lol / perpage) ? parseInt(args[1]) : 1;
      sorted.forEach(c => {
        if (c.help.category.toLowerCase() == args[0]) {
    
          if (num < perpage * page && num > perpage * page - (perpage + 1)) {
            output += `\n\`${settings.prefix + c.help.name}\` | ${c.help.description.length > 50 ? c.help.description.slice(0,50) +"...": c.help.description}`;
          }
          num = num + 1;
        }
      });
    
    
      if (num != 0) {
        //message.channel.send(`${title}\n\n${description}\n${output}`, {code:"asciidoc"});
        embed.setTitle("Command category help")
          .setDescription(`A list of commands in the ${args[0]} category.  (Total of ${num} commands in this category)\n\nTo get help on a specific command do \`${settings.prefix}help <command>\``)
          .addField("Commands", output)
          .setAuthor(message.author.tag, message.author.avatarURL())
          .setTimestamp()
          .setColor(message.guild.me.roles.highest.color || 0x00AE86)
          .setFooter("Misaki", this.client.user.avatarURL());
        message.channel.send({embed});
    
      }
    }

    // Show individual command's help.
    let command = args[0];
    if (client.commands.has(command) || client.commands.forEach(command => {if (command.conf.aliases.includes(command)) return true;})) {
      command = client.commands.get(command);
      if (level < client.levelCache[command.conf.permLevel]) return;
      embed.setTitle(`${args[0]} help`)
        .setAuthor(message.author.tag, message.author.avatarURL())
        .addField("Command description", command.help.description)
        .addField("Command usage", `\`${command.help.usage}\``)
        .addField("Command aliases", command.conf.aliases.length == 0 ? "None" : command.conf.aliases.join(", ") )
        .setTimestamp()
        .setColor(message.guild.me.roles.highest.color || 0x00AE86)
        .setFooter("Misaki", this.client.user.avatarURL());
    
      message.channel.send({embed});

    }
  }
}

module.exports = Help;