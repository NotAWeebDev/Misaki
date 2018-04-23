const Command = require("../../structures/Command.js");

class Set extends Command {
  constructor(...args) {
    super(...args, {
      name: "set",
      description: "View or change settings for your server.",
      category: "System",
      usage: "set <view/get/edit> <key> <value>",
      aliases: ["setting", "settings"],
      permLevel: "Administrator"
    });
  }

  async run(message, [action, key, ...value], level) { // eslint-disable-line no-unused-vars

    const settings = message.settings;
    const overrides = this.client.settings.get(message.guild.id);
  
    if (action === "edit") {
      if (!key) return message.reply("Please specify a key to edit");
      if (!settings[key]) return message.reply("This key does not exist in the settings");
      if (value.length < 1) return message.reply("Please specify a new value");
    
      if (value.join(" ") === settings[key]) return message.reply("This setting already has that value!");
      if (!this.client.settings.has(message.guild.id)) this.client.settings.set(message.guild.id, {});
      this.client.settings.setProp(message.guild.id, key, value.join(" "));

      message.reply(`${key} successfully edited to ${value.join(" ")}`);
    } else
  
    if (action === "del" || action === "reset") {
      if (!key) return message.reply("Please specify a key to delete (reset).");
      if (!settings[key]) return message.reply("This key does not exist in the settings");
      if (!overrides[key]) return message.reply("This key does not have an override and is already using defaults.");
      
      const filter = m => m.author.id === message.author.id;
      const response = await message.awaitReply(`Are you sure you want to reset \`${key}\` to the default value?`, filter, undefined, null);

      if (["y", "yes"].includes(response.toLowerCase())) {

        delete overrides[key];
        this.client.settings.set(message.guild.id, overrides);
        message.reply(`${key} was successfully reset.`);
      } else

      if (["n","no","cancel"].includes(response)) {
        message.reply(`Your setting for \`${key}\` remains at \`${settings[key]}\``);
      }
    } else
  
    if (action === "get") {
      if (!key) return message.reply("Please specify a key to view");
      if (!settings[key]) return message.reply("This key does not exist in the settings");
      const isDefault = !overrides[key] ? "\nThis is the default global default value." : "";
      message.reply(`The value of ${key} is currently ${settings[key]}${isDefault}`);      
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