const Command = require(`${process.cwd()}/base/Command.js`);
const { MessageEmbed } = require('discord.js');

const perpage = 10;
let on = false;

class Help extends Command {
  constructor(client) {
    super(client, {
      name: 'help',
      description: 'Get help on a command, command category, or a setting',
      extended: "This command will display all available commands for your permission level, with the additonal option of getting per command information when you run 'help <command name>'.",
      category: 'System',
      usage: 'help <category/command/setting>',
      aliases: ['h', 'halp', 'commands'],
    });
  }

  async run(message, [type], level) {
    let page = 1;
    let n;
    let finalpage;

    const embed = new MessageEmbed()
      .setTimestamp()
      .setColor(message.guild.me.roles.highest.color || 5198940)
      .setFooter(`Requested by ${message.author.tag}`, message.author.avatarURL());

    let currentCategory = '';
    const sorted = this.client.commands.sort((p, c) => (p.help.cat > c.help.cat ? 1 : p.help.name > c.help.name && p.help.cat === c.help.cat ? 1 : -1));
    if (!type) {
      const description = `Command category list\n\nUse \`${message.settings.prefix}help <category>\` to find commands for a specific category`;
      const output = sorted.filter(c => !(level < 10 && c.help.category === 'Owner') || !(c.help.category === 'NSFW' && !message.channel.nsfw)).map((c) => {
        const cat = c.help.cat;
        if (currentCategory !== cat && !type) {
          currentCategory = cat;
          return `\n\`${message.settings.prefix}help ${cat.toLowerCase()}\` | Shows ${cat} commands`;
        }
      }).join('');
      embed.setDescription(description)
        .addField('Categories', output);
    } else {
      n = 0;
      sorted.forEach((c) => {
        if (c.help.cat.toLowerCase() === type.toLowerCase()) {
          n++;
        }
      });

      let output = '';
      let num = 0;
      const pg = parseInt(page) && parseInt(page) <= Math.ceil(n / perpage) ? parseInt(page) : 1;
      for (const c of sorted.values()) {
        if (c.help.cat.toLowerCase() === type.toLowerCase()) {
          if (c.help.cat === 'NSFW' && !message.channel.nsfw) return;
          if (num < perpage * pg && num > perpage * pg - (perpage + 1)) {
            if (level < this.client.levelCache[c.conf.permLevel]) return;
            output += `\n\`${message.settings.prefix + c.help.name}\` | ${c.help.description.length > 80 ? `${c.help.description.slice(0, 80)}...` : c.help.description}`;
          }
          num++;
        }
      }

      if (num) {
        finalpage = Math.ceil(num / perpage);
        embed.setTitle(`Page ${page}/${Math.ceil(num / perpage)}`)
          .setDescription(`A list of commands in the ${type} category.\n(Total of ${num} commands in this category)\n\nTo get help on a specific command do \`${message.settings.prefix}help <command>\`\n\n${num > 10 && pg === 1 ? `To view more commands do\` ${message.settings.prefix}help <category> 2\`` : ''}`)
          .addField('Commands', output);
      }
    }

    if (this.client.commands.has(type) || this.client.commands.some(command => command.conf.aliases.includes(type))) {
      const cm = this.client.commands.get(type) || this.client.commands.get(this.client.aliases.get(type));
      if (level < this.client.levelCache[cm.conf.permLevel]) return;
      embed.setTitle(cm.help.name)
        .addField('Command description', cm.help.description)
        .addField('Command usage', `\`${cm.help.usage}\``)
        .addField('Command aliases', cm.conf.aliases.length === 0 ? 'None' : cm.conf.aliases.join(', '));
    }

    const msg2 = await message.channel.send(embed);
    if (!message.guild.me.hasPermission(['MANAGE_MESSAGES'])) {
      await message.channel.send('I don\'t have permission to remove reactions, please do this manually.');
    }
    if (msg2.embeds[0].title) {
      await msg2.react('⏮');
      await msg2.react('◀');
      await msg2.react('⏹');
      await msg2.react('▶');
      await msg2.react('⏭');
      await msg2.react('🔢');
    }

    const nextpage = msg2.createReactionCollector(
      (reaction, user) => reaction.emoji.name === '▶' && user.id === message.author.id,
      { time: 1500000 },
    );

    const backpage = msg2.createReactionCollector(
      (reaction, user) => reaction.emoji.name === '◀' && user.id === message.author.id,
      { time: 1500000 },
    );

    const firstpage = msg2.createReactionCollector(
      (reaction, user) => reaction.emoji.name === '⏮' && user.id === message.author.id,
      { time: 1500000 },
    );

    const lastpage = msg2.createReactionCollector(
      (reaction, user) => reaction.emoji.name === '⏭' && user.id === message.author.id,
      { time: 1500000 },
    );

    const numberpages = msg2.createReactionCollector(
      (reaction, user) => reaction.emoji.name === '🔢' && user.id === message.author.id,
      { time: 1500000 },
    );

    const stop = msg2.createReactionCollector(
      (reaction, user) => reaction.emoji.name === '⏹' && user.id === message.author.id,
      { time: 1500000 },
    );

    nextpage.on('collect', (r) => {
      num = 0;
      page = parseInt(msg2.embeds[0].title.split(' ')[1].split('/')[0]) + 1;
      output = '';
      const pg = parseInt(page) && parseInt(page) <= Math.ceil(n / perpage) ? parseInt(page) : 1;
      for (const c of sorted.values()) {
        if (c.help.cat.toLowerCase() === type.toLowerCase()) {
          if (c.help.cat === 'NSFW' && !message.channel.nsfw) return;
          if (num < perpage * pg && num > perpage * pg - (perpage + 1)) {
            if (level < this.client.levelCache[c.conf.permLevel]) return;
            output += `\n\`${message.settings.prefix + c.help.name}\` | ${c.help.description.length > 80 ? `${c.help.description.slice(0, 80)}...` : c.help.description}`;
          }
          num++;
        }
      }
      r.users.remove(message.author);
      if (page > Math.ceil(num / perpage)) return;
      msg2.edit({
        embed: {
          title: `Page ${page}/${Math.ceil(num / perpage)}`,
          description: `A list of commands in the ${type} category.\n(Total of ${num} commands in this category)\n\nTo get help on a specific command do \`${message.settings.prefix}help <command>\`\n\n${num > 10 && pg === 1 ? `To view more commands do\` ${message.settings.prefix}help <category> 2\`` : ''}`,
          fields: [
            {
              name: 'Commands',
              value: output,
            },
          ],
          color: message.guild.me.roles.highest.color || 5198940,
          footer: {
            text: `Requested by ${message.author.tag}`,
            icon_url: message.author.avatarURL(),
          },
        },
      });
    });

    backpage.on('collect', (r) => {
      page = parseInt(msg2.embeds[0].title.split(' ')[1].split('/')[0]) - 1;
      output = '';
      num = 0;
      const pg = parseInt(page) && parseInt(page) <= Math.ceil(n / perpage) ? parseInt(page) : 1;
      for (const c of sorted.values()) {
        if (c.help.cat.toLowerCase() === type.toLowerCase()) {
          if (c.help.cat === 'NSFW' && !message.channel.nsfw) return;
          if (num < perpage * pg && num > perpage * pg - (perpage + 1)) {
            if (level < this.client.levelCache[c.conf.permLevel]) return;
            output += `\n\`${message.settings.prefix + c.help.name}\` | ${c.help.description.length > 80 ? `${c.help.description.slice(0, 80)}...` : c.help.description}`;
          }
          num++;
        }
      }
      r.users.remove(message.author);
      if (page === 0) return;
      msg2.edit({
        embed: {
          title: `Page ${page}/${Math.ceil(num / perpage)}`,
          description: `A list of commands in the ${type} category.\n(Total of ${num} commands in this category)\n\nTo get help on a specific command do \`${message.settings.prefix}help <command>\`\n\n${num > 10 && pg === 1 ? `To view more commands do\` ${message.settings.prefix}help <category> 2\`` : ''}`,
          fields: [
            {
              name: 'Commands',
              value: output,
            },
          ],
          color: message.guild.me.roles.highest.color || 5198940,
          footer: {
            text: `Requested by ${message.author.tag}`,
            icon_url: message.author.avatarURL(),
          },
        },
      });
    });

    firstpage.on('collect', (r) => {
      page = 1;
      output = '';
      num = 0;
      const pg = parseInt(page) && parseInt(page) <= Math.ceil(n / perpage) ? parseInt(page) : 1;
      for (const c of sorted.values()) {
        if (c.help.cat.toLowerCase() === type.toLowerCase()) {
          if (c.help.cat === 'NSFW' && !message.channel.nsfw) return;
          if (num < perpage * pg && num > perpage * pg - (perpage + 1)) {
            if (level < this.client.levelCache[c.conf.permLevel]) return;
            output += `\n\`${message.settings.prefix + c.help.name}\` | ${c.help.description.length > 80 ? `${c.help.description.slice(0, 80)}...` : c.help.description}`;
          }
          num++;
        }
      }
      r.users.remove(message.author);
      if (page === 0) return;
      msg2.edit({
        embed: {
          title: `Page ${page}/${Math.ceil(num / perpage)}`,
          description: `A list of commands in the ${type} category.\n(Total of ${num} commands in this category)\n\nTo get help on a specific command do \`${message.settings.prefix}help <command>\`\n\n${num > 10 && pg === 1 ? `To view more commands do\` ${message.settings.prefix}help <category> 2\`` : ''}`,
          fields: [
            {
              name: 'Commands',
              value: output,
            },
          ],
          color: message.guild.me.roles.highest.color || 5198940,
          footer: {
            text: `Requested by ${message.author.tag}`,
            icon_url: message.author.avatarURL(),
          },
        },
      });
    });

    lastpage.on('collect', (r) => {
      page = finalpage;
      output = '';
      num = 0;
      const pg = parseInt(page) && parseInt(page) <= Math.ceil(n / perpage) ? parseInt(page) : 1;
      for (const c of sorted.values()) {
        if (c.help.cat.toLowerCase() === type.toLowerCase()) {
          if (c.help.cat === 'NSFW' && !message.channel.nsfw) return;
          if (num < perpage * pg && num > perpage * pg - (perpage + 1)) {
            if (level < this.client.levelCache[c.conf.permLevel]) return;
            output += `\n\`${message.settings.prefix + c.help.name}\` | ${c.help.description.length > 80 ? `${c.help.description.slice(0, 80)}...` : c.help.description}`;
          }
          num++;
        }
      }
      r.users.remove(message.author);
      if (page === 0) return;
      msg2.edit({
        embed: {
          title: `Page ${page}/${Math.ceil(num / perpage)}`,
          description: `A list of commands in the ${type} category.\n(Total of ${num} commands in this category)\n\nTo get help on a specific command do \`${message.settings.prefix}help <command>\`\n\n${num > 10 && pg === 1 ? `To view more commands do\` ${message.settings.prefix}help <category> 2\`` : ''}`,
          fields: [
            {
              name: 'Commands',
              value: output,
            },
          ],
          color: message.guild.me.roles.highest.color || 5198940,
          footer: {
            text: `Requested by ${message.author.tag}`,
            icon_url: message.author.avatarURL(),
          },
        },
      });
    });

    stop.on('collect', (r) => {
      nextpage.stop();
      backpage.stop();
      firstpage.stop();
      lastpage.stop();
      numberpages.stop();
      stop.stop();
      r.message.reactions.removeAll();
    });

    numberpages.on('collect', async (r) => {
      if (on) return;
      on = true;
      num = 0;
      let numbers;
      await message.channel.send(`Please enter a selection from 1 to ${finalpage}`);
      await message.channel.awaitMessages(m => !isNaN(m.content) && m.author.id === message.author.id, {
        max: 1,
        time: 10000,
        errors: ['time'],
      }).then(async (collected) => {
        page = parseInt(collected.first().content);
        output = '';
        const pg = parseInt(page) && parseInt(page) <= Math.ceil(n / perpage) ? parseInt(page) : 1;
        for (const c of sorted.values()) {
          if (c.help.cat.toLowerCase() === type.toLowerCase()) {
            if (c.help.cat === 'NSFW' && !message.channel.nsfw) return;
            if (num < perpage * pg && num > perpage * pg - (perpage + 1)) {
              if (level < this.client.levelCache[c.conf.permLevel]) return;
              output += `\n\`${message.settings.prefix + c.help.name}\` | ${c.help.description.length > 80 ? `${c.help.description.slice(0, 80)}...` : c.help.description}`;
            }
            num++;
          }
        }
        r.users.remove(message.author);
        if (page > Math.ceil(num / perpage)) return;
        msg2.edit({
          embed: {
            title: `Page ${page}/${Math.ceil(num / perpage)}`,
            description: `A list of commands in the ${type} category.\n(Total of ${num} commands in this category)\n\nTo get help on a specific command do \`${message.settings.prefix}help <command>\`\n\n${num > 10 && pg === 1 ? `To view more commands do\` ${message.settings.prefix}help <category> 2\`` : ''}`,
            fields: [
              {
                name: 'Commands',
                value: output,
              },
            ],
            color: message.guild.me.roles.highest.color || 5198940,
            footer: {
              text: `Requested by ${message.author.tag}`,
              icon_url: message.author.avatarURL(),
            },
          },
        });
      });
      on = false;
    });
  }
}

module.exports = Help;
