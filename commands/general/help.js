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

    const embed = new MessageEmbed()
      .setAuthor(message.author.tag, message.author.avatarURL())
      .setAuthor(message.author.tag, message.author.avatarURL())
      .setTimestamp()
      .setColor(message.guild.me.roles.highest.color || 0x00AE86)
      .setFooter("Misaki", this.client.user.avatarURL()); 
    // Preload MessageEmbed.
  
    // Here we sort out categories in case the user did not provide an argument.
    
    let currentCategory = "";
    const sorted = this.client.commands.array().sort((p, c) => p.help.category > c.help.category ? 1 :  p.help.name > c.help.name && p.help.category === c.help.category ? 1 : -1 );
    if (!args[0]) {
      const description = `Command category list\n\nUse \`${message.settings.prefix}help <category>\` to find commands for a specific category`;
      let output = "";
      sorted.forEach( c => {
        const cat = c.help.category.toProperCase();
    
        if (currentCategory !== cat && !args[0]) {
          output += `\`${message.settings.prefix}help ${cat.toLowerCase()}\` | Shows ${cat} commands\n`;
          currentCategory = cat;
        }
      });

      embed.setTitle("Misaki Help")
        .setDescription(description)
        .addField("Categories", output);

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
            output += `\n\`${message.settings.prefix + c.help.name}\` | ${c.help.description.length > 50 ? c.help.description.slice(0,50) +"...": c.help.description}`;
          }
          num = num + 1;
        }
      });
    
    
      if (num != 0) {
        //message.channel.send(`${title}\n\n${description}\n${output}`, {code:"asciidoc"});
        embed.setTitle("Command category help")
          .setDescription(`A list of commands in the ${args[0]} category.  (Total of ${num} commands in this category)\n\nTo get help on a specific command do \`${message.settings.prefix}help <command>\``)
          .addField("Commands", output);

        message.channel.send({embed});
    
      }
    }

    // Show individual command's help.
    let command = args[0];
    if (this.client.commands.has(command) || this.client.commands.forEach(command => {if (command.conf.aliases.includes(command)) return true;})) {
      command = this.client.commands.get(command);
      if (level < this.client.levelCache[command.conf.permLevel]) return;
      embed.setTitle(`${args[0]} help`)
        .addField("Command description", command.help.description)
        .addField("Command usage", `\`${command.help.usage}\``)
        .addField("Command aliases", command.conf.aliases.length == 0 ? "None" : command.conf.aliases.join(", ") );
    
      message.channel.send({embed});

    }
  }
}

module.exports = Help;