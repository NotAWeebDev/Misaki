const Command = require("../../structures/Command.js");

class Set extends Command {
  constructor(client) {
    super(client, {
      name: "set",
      description: "View or change settings for your server.",
      category: "System",
      usage: "set <view/get/edit> <key> <value>",
      guildOnly: true,
      aliases: ["setting", "settings"],
      permLevel: "Administrator"
    });
  }

  async run(message, [action, key, ...value], level) { // eslint-disable-line no-unused-vars

    const defaults = this.client.config.defaultSettings;

    if (action === "edit") {
      if (!key) return message.reply("Please specify a key to edit");
      if (!message.settings[key].toString()) return message.reply("This key does not exist in the settings");
      if (value.length < 1) return message.reply("Please specify a new value");
    
      const data = { [key]: value.join(" ") };
      await this.client.writeSettings(message.guild.id, data);
      await message.reply(`${key} successfully edited to ${value.join(" ")}`);
    } else
  
    // Thirdly, if a user does `-set del <key>`, let's ask the user if they're sure...
    if (action === "del" || action === "reset") {
      if (!key) return message.reply("Please specify a key to delete (reset).");
      if (!message.settings[key]) return message.reply("This key does not exist in the settings");
      
      // Throw the 'are you sure?' text at them.
      const response = await this.client.awaitReply(message, `Are you sure you want to reset \`${key}\` to the default \`${defaults[key]}\`?`);

      // If they respond with y or yes, continue.
      if (["y", "yes"].includes(response)) {
        const data = { [key]: defaults[key] };
        await this.client.writeSettings(message.guild.id, data);
        await message.reply(`${key} was successfully reset to default.`);
      } else

      // If they respond with n or no, we inform them that the action has been cancelled.
      if (["n","no","cancel"].includes(response)) {
        message.reply(`Your setting for \`${key}\` remains at \`${message.settings[key]}\``);
      }
    } else
  
    // Using `-set get <key>` we simply return the current value for the guild.
    if (action === "get") {
      if (!key) return message.reply("Please specify a key to view");
      if (!message.settings[key]) return message.reply("This key does not exist in the settings");
      message.reply(`The value of ${key} is currently ${message.settings[key]}`);
      
    } else {
      // Otherwise, the default action is to return the whole configuration in JSON format (to be prettified!);
      const array = [];
      Object.entries(message.settings).forEach(([key, value]) => {
        if (key === "updatedAt" || key === "createdAt" ||key === "id") return;
        array.push(`${key}${" ".repeat(20 - key.length)}::  ${value}`); 
      });
      await message.channel.send(`= Current Guild Settings =\n${array.join("\n")}`, {code: "asciidoc"});
    }
  }
}

module.exports = Set;
