const Command = require(`${process.cwd()}/base/Command.js`);

class Set extends Command {
  constructor(client) {
    super(client, {
      name: "set",
      description: "View or change settings for your server.",
      category: "Utilities",
      usage: "set <view/get/edit> <key> <value>",
      aliases: ["setting", "settings"],
      permLevel: "Administrator"
    });
  }

  async run(message, [action, key, ...value], level) { // eslint-disable-line no-unused-vars

    const settings = message.settings;
    const defaults = this.client.settings.get("default");
  
    if (action === "edit") {
      if (!key) return message.reply("Please specify a key to edit");
      if (!settings[key]) return message.reply("This key does not exist in the settings");
      if (value.length < 1) return message.reply("Please specify a new value");
    
      settings[key] = value.join(" ");

      this.client.settings.set(message.guild.id, settings);
      message.reply(`${key} successfully edited to ${value.join(" ")}`);
    } else
  
    if (action === "del" || action === "reset") {
      if (!key) return message.reply("Please specify a key to delete (reset).");
      if (!settings[key]) return message.reply("This key does not exist in the settings");
      
      const filter = m => m.author.id === message.author.id;
      const response = await this.client.awaitReply(message, `Are you sure you want to reset \`${key}\` to the default \`${defaults[key]}\`?`, filter, undefined, null);

      if (["y", "yes"].includes(response)) {

        delete settings[key];
        this.client.settings.set(message.guild.id, settings);
        message.reply(`${key} was successfully reset to default.`);
      } else

      if (["n","no","cancel"].includes(response)) {
        message.reply(`Your setting for \`${key}\` remains at \`${settings[key]}\``);
      }
    } else
  
    if (action === "get") {
      if (!key) return message.reply("Please specify a key to view");
      if (!settings[key]) return message.reply("This key does not exist in the settings");
      message.reply(`The value of ${key} is currently ${settings[key]}`);
      
    } else {
      const array = [];
      Object.entries(settings).forEach(([key, value]) => {
        array.push(`${key}${" ".repeat(20 - key.length)}::  ${value}`); 
      });
      await message.channel.send(`= Current Guild Settings =
${array.join("\n")}`, {code: "asciidoc"});
    }
  }
}

module.exports = Set;
