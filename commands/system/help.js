const Command = require(`${process.cwd()}/base/Command.js`);
const { MessageEmbed } = require("discord.js");
const emojis = ["⏮", "◀", "⏹", "▶", "⏭", "🔢"];
const perpage = 10;
let on = false;

class Help extends Command {
  constructor(client) {
    super(client, {
      name: "help",
      description: "Get help on a command, command category, or a setting",
      extended: "This command will display all available commands for your permission level, with the additonal option of getting per command information when you run 'help <command name>'.",
      category: "System",
      usage: "help <category/command/setting>",
      aliases: ["h", "halp", "commands"],
    });
    this.pages = async (message, msg2, page, sorted, type, level, r, this2, hm) => {
      let n = 0;
      sorted.forEach((c) => {
        if (c.help.category.toLowerCase() === type.toLowerCase()) {
          n++;
        }
      });

      let num = 0;
      let output = "";
      const pg = Number(page) && Number(page) <= Math.ceil(n / perpage) ? Number(page) : 1;
      for (const c of sorted.values()) {
        if (c.help.category.toLowerCase() === type.toLowerCase()) {
          if (c.help.cat === "NSFW" && !message.channel.nsfw) return;
          if (num < perpage * pg && num > perpage * pg - (perpage + 1)) {
            if (level < this2.client.levelCache[c.conf.permLevel]) return;
            output = `${output}\n\`${message.settings.prefix + c.help.name}\` | ${c.help.description.length > 80 ? `${c.help.description.slice(0, 80)}...` : c.help.description}`;
          }
          num++;
        }
      }
      r.users.remove(message.author);
      if (hm === "forward") {
        if (page > Math.ceil(num / perpage)) return;
      }
      if (hm === "backward") {
        if (page === 0) return;
      }
      const helpembed = new MessageEmbed()
        .setTitle(`Page ${page}/${Math.ceil(num / perpage)} for ${type.toProperCase()}`)
        .setDescription(`A list of commands in the ${type} category.\n(Total of ${num} commands in this category)\n\nTo get help on a specific command do \`${message.settings.prefix}help <command>\``)
        .addField("Commands", output)
        .setColor(message.guild.me.roles.highest.color || 5198940)
        .setFooter(`Requested by ${message.author.tag}`, message.author.avatarURL());
      await msg2.edit(helpembed);
    };
  }

  async run(message, [type], level) {
    let page = 1;
    let n = 0;
    let num = 0;

    const embed = new MessageEmbed()
      .setTimestamp()
      .setColor(message.guild.me.roles.highest.color || 5198940)
      .setFooter(`Requested by ${message.author.tag}`, message.author.avatarURL());

    const currentCategory = "";
    const last = [];
    const sorted = this.client.commands.sort((p, c) => (p.help.cat > c.help.category ? 1 : p.help.name > c.help.name && p.help.cat === c.help.category ? 1 : -1));
    if (!type) {
      const description = `Command category list\n\nUse \`${message.settings.prefix}help <category>\` to find commands for a specific category`;
      const output = sorted.filter(c => !(level < 10 && c.help.category === "Owner") || !(c.help.category === "NSFW" && !message.channel.nsfw)).map((c) => {
        const cat = c.help.category;
        if (currentCategory !== cat && !type) {
          if (last.includes(cat.toLowerCase())) return;
          last.push(cat.toLowerCase());
          return `\n\`${message.settings.prefix}help ${cat.toLowerCase()}\``;
        }
      }).join("");
      embed.setDescription(description)
        .addField("Categories", output);
    } else {
      sorted.forEach((c) => {
        if (c.help.category.toLowerCase() === type.toLowerCase()) {
          n++;
        }
      });
      let output = "";
      const pg = Number(page) && Number(page) <= Math.ceil(n / perpage) ? Number(page) : 1;
      for (const c of sorted.values()) {
        if (c.help.category.toLowerCase() === type.toLowerCase()) {
          if (c.help.category === "NSFW" && !message.channel.nsfw) return;
          if (num < perpage * pg && num > perpage * pg - (perpage + 1)) {
            if (level < this.client.levelCache[c.conf.permLevel]) return;
            output += `\n\`${message.settings.prefix + c.help.name}\` | ${c.help.description.length > 80 ? `${c.help.description.slice(0, 80)}...` : c.help.description}`;
          }
          num++;
        }
      }

      if (num) {
        Math.ceil(num / perpage) === 1 ?
          embed.setTitle(type.toProperCase())
            .setDescription(`A list of commands in the ${type} category.\n(Total of ${num} commands in this category)\n\nTo get help on a specific command do \`${message.settings.prefix}help <command>\``)
            .addField("Commands", output)
          :
          embed.setTitle(`Page ${page}/${Math.ceil(num / perpage)} for ${type.toProperCase()}`)
            .setDescription(`A list of commands in the ${type} category.\n(Total of ${num} commands in this category)\n\nTo get help on a specific command do \`${message.settings.prefix}help <command>\``)
            .addField("Commands", output);
      }
    }

    if (this.client.commands.has(type) || this.client.aliases.has(type)) {
      const cm = this.client.commands.get(type) || this.client.commands.get(this.client.aliases.get((type)));
      if (level < this.client.levelCache[cm.conf.permLevel]) return;
      embed.setTitle(cm.help.name)
        .addField("Command description", cm.help.description)
        .addField("Command usage", `\`${cm.help.usage}\``)
        .addField("Command aliases", cm.conf.aliases.length === 0 ? "None" : cm.conf.aliases.join(", "));
    }
    const msg2 = await message.channel.send(embed);
    const totalpages = Math.ceil(num / perpage);
    if (!message.guild.me.hasPermission(["MANAGE_MESSAGES"])) {
      await message.channel.send("I don\t have permission to remove reactions, please do this manually.");
    }

    if (msg2.embeds[0].title) {
      if (msg2.embeds[0].title.includes("Page")) {
        for (const emoji of emojis) await msg2.react(emoji);
      }
    }

    const select = await msg2.createReactionCollector(
      (reaction, user) => emojis.includes(reaction.emoji.name) && user.id === message.author.id,
      { time: 300000 },
    );

    if (select) {
      select.on("collect", async (r) => {
        switch (r.emoji.name) {
          case "▶":
            this.pages(message, msg2, Number(msg2.embeds[0].title.split(" ")[1].split("/")[0]) + 1, sorted, type, level, r, this, "forward");
            break;
          case "◀":
            this.pages(message, msg2, Number(msg2.embeds[0].title.split(" ")[1].split("/")[0]) - 1, sorted, type, level, r, this, "backward");
            break;
          case "⏮":
            this.pages(message, msg2, 1, sorted, type, level, r, this);
            break;
          case "⏭":
            this.pages(message, msg2, Math.ceil(totalpages), sorted, type, level, r, this);
            break;
          case "⏹":
            select.stop();
            r.message.reactions.removeAll();
            break;
          case "🔢":
            if (on) return;
            on = true;
            await r.message.channel.send(`Please enter a selection from 1 to ${totalpages}`);
            await message.channel.awaitMessages(m => !isNaN(m.content) && m.author.id === message.author.id, {
              max: 1,
              time: 300000,
              errors: ["time"],
            }).then(async (collected) => {
              page = Number(collected.first().content);
              this.pages(message, msg2, page, sorted, type, level, r, this);
            });
            on = false;
            break;
        }
      });

      select.on("end", (r, reason) => {
        if (reason === "time") {
          msg2.reactions.removeAll();
        }
      });
    }
  }
}

module.exports = Help;
