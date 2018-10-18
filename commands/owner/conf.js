const Owner = require("../../structures/Owner.js");

class Conf extends Owner {
  constructor(...args) {
    super(...args, {
      name: "conf",
      description: "Modify the default configuration for all guilds.",
      category: "Creator",
      usage: "conf <view/get/edit> <key> <value>",
      aliases: ["defaults"]
    });
  }

  async run(message, [action, key, ...value], level) { // eslint-disable-line no-unused-vars
    
    const defaults = this.client.settings.get("default");
  
    if (action === "add") {
      if (!key) return message.reply("Please specify a key to add");
      if (defaults[key]) return message.reply("This key already exists in the default settings");
      if (value.length < 1) return message.reply("Please specify a value");

      defaults[key] = value.join(" ");
  
      this.client.settings.set("default", defaults);
      message.reply(`${key} successfully added with the value of ${value.join(" ")}`);
    } else
  
    if (action === "edit") {
      if (!key) return message.reply("Please specify a key to edit");
      if (!defaults[key]) return message.reply("This key does not exist in the settings");
      if (value.length < 1) return message.reply("Please specify a new value");

      defaults[key] = value.join(" ");

      this.client.settings.set("default", defaults);
      message.reply(`${key} successfully edited to ${value.join(" ")}`);
    } else
  
    if (action === "del") {
      if (!key) return message.reply("Please specify a key to delete.");
      if (!defaults[key]) return message.reply("This key does not exist in the settings");
      const filter = m => m.author.id === message.author.id;

      const response = await message.awaitReply(`Are you sure you want to permanently delete ${key} from all guilds? This **CANNOT** be undone.`, filter, undefined, null);

      if (["y", "yes"].includes(response)) {

        delete defaults[key];
        this.client.settings.set("default", defaults);
      
        for (const [guildid, conf] of this.client.settings.filter((setting, id) => setting[key] && id !== "default")) {
          delete conf[key];
          this.client.settings.set(guildid, conf);
        }
      
        message.reply(`${key} was successfully deleted.`);
      } else

      if (["n","no","cancel"].includes(response)) {
        message.reply("Action cancelled.");
      }
    } else
  
    if (action === "get") {
      if (!key) return message.reply("Please specify a key to view");
      if (!defaults[key]) return message.reply("This key does not exist in the settings");
      message.reply(`The value of ${key} is currently ${defaults[key]}`);

    } else {
      const array = [];
      Object.entries(this.client.settings.get("default")).forEach(([key, value]) => {
        array.push(`${key}${" ".repeat(20 - key.length)}::  ${value}`); 
      });
      await message.channel.send(`= Bot Default Settings =
${array.join("\n")}`, {code: "asciidoc"});    }
  }
}

module.exports = Conf;
