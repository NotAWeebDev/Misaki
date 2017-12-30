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
      aliases: ["h", "halp"],
      botPerms: []
    });
  }

  async run(message, args, level) {
    const settings = message.settings;
    if (!args[0]) {
      const myCommands = message.guild ? this.client.commands.filter(cmd => this.client.levelCache[cmd.conf.permLevel] <= level && cmd.conf.hidden !== true) : this.client.commands.filter(cmd => this.client.levelCache[cmd.conf.permLevel] <= level && cmd.conf.hidden !== true && cmd.conf.guildOnly !== true);
      const commandNames = myCommands.keyArray();
      const longest = commandNames.reduce((long, str) => Math.max(long, str.length), 0);
      let currentCategory = "";
      let output = `= Command List =\n\n[Use ${settings.prefix}help <commandname> for details]\n`;
      const sorted = myCommands.array().sort((p, c) => p.help.category > c.help.category ? 1 :  p.help.name > c.help.name && p.help.category === c.help.category ? 1 : -1 );
      sorted.forEach( c => {
        const cat = c.help.category.toProperCase();
        if (currentCategory !== cat) {
          output += `\u200b\n== ${cat} ==\n`;
          currentCategory = cat;
        }
        output += `${settings.prefix}${c.help.name}${" ".repeat(longest - c.help.name.length)} :: ${c.help.description}\n`;
      });
      message.channel.send(output, {code:"asciidoc", split: { char: "\u200b" }});
    } else {
      let command = args[0];
      
      if (this.client.commands.has(command)) command = this.client.commands.get(command);
      else if (this.client.aliases.has(command)) command = this.client.commands.get(this.client.aliases.get(command));
      else return;
      
      if (!message.guild && command.conf.guildOnly === true) return;
      if (level < this.client.levelCache[command.conf.permLevel]) return;
      message.channel.send(`= ${command.help.name} = \n${command.help.description}\ncategory     :: ${command.help.category}\ncost         :: ${parseInt(command.help.cost) * parseInt(command.conf.botPerms.length + 1) * Math.floor(parseInt(settings.costMulti))} points (excluding role discounts)\nusage        :: ${command.help.usage}\naliases      :: ${command.conf.aliases.join(", ")}\ndetails      :: ${command.help.extended}\npermissions  :: ${command.conf.botPerms.join(", ")}`, {code:"asciidoc"});    }
  }
}
module.exports = Help;