const Command = require(`${process.cwd()}/base/Command.js`);

class Help extends Command {
  constructor(client) {
    super(client, {
      name: "help",
      description: "Displays the commands for your level.",
      usage: "help [command]",
      category: "System",
      extended: "This command will display all available commands for your permission level, with the additonal option of getting per command information when you run 'help <command name>'.",
      hidden: true,
      aliases: ["h", "halp", "commands"]
    });
  }

  async run(message, args, level) {
    const settings = message.settings;
    if (!args[0]) {
      try {
        const myCommands = message.guild ? this.client.commands.filter(cmd => this.client.levelCache[cmd.conf.permLevel] <= level && cmd.conf.hidden !== true) : this.client.commands.filter(cmd => this.client.levelCache[cmd.conf.permLevel] <= level && cmd.conf.hidden !== true && cmd.conf.guildOnly !== true);
        const commandNames = myCommands.keyArray();
        const longest = commandNames.reduce((long, str) => Math.max(long, str.length), 0);
        let currentCategory = "";
        let output = `= Command List =\n\n[Use ${settings.prefix}help <commandname> in a guild channel for details]\n`;
        const sorted = myCommands.array().sort((p, c) => p.help.category > c.help.category ? 1 :  p.help.name > c.help.name && p.help.category === c.help.category ? 1 : -1 );
        sorted.forEach( c => {
          const cat = c.help.category.toProperCase();
          if (currentCategory !== cat) {
            output += `\u200b\n== ${cat} ==\n`;
            currentCategory = cat;
          }
          output += `${settings.prefix}${c.help.name}${" ".repeat(longest - c.help.name.length)} :: ${c.help.description}\n`;
        });
        await message.channel.send("Please check your inbox for a list of my commands.");
        await message.author.send(output, {code:"asciidoc", split: { char: "\u200b" }});
      } catch (error) {
        if (error.message === "Cannot send messages to this user") {
          return message.reply("I cannot send you the commands message, as it appears you have **Direct Messages's** disabled.");
        } else {
          throw error;
        }       
      }
    } else {
      let command = args[0];
      
      if (this.client.commands.has(command)) command = this.client.commands.get(command);
      else if (this.client.aliases.has(command)) command = this.client.commands.get(this.client.aliases.get(command));
      else return;
      
      if (!message.guild && command.conf.guildOnly === true) return;
      if (level < this.client.levelCache[command.conf.permLevel]) return;
      message.channel.send(`= ${command.help.name} = \n${command.help.description}\ncategory     :: ${command.help.category}\ncost         :: ₲${parseInt(command.help.cost)}\nusage        :: ${command.help.usage}\naliases      :: ${command.conf.aliases.join(", ")}\ndetails      :: ${command.help.extended}`, {code:"asciidoc"});    }
  }
}
module.exports = Help;