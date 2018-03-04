/* eslint linebreak-style: 0 */
const Command = require(`${process.cwd()}/base/Command.js`);
const { MessageEmbed } = require("discord.js");

class Loop extends Command {
  constructor(client) {
    super(client, {
      name: "loop",
      description: "This command will display the current playing song.",
      usage: "np",
      category: "Music",
      aliases: ["unloop"],
    });
  }

  async run(message, args, level) { // eslint-disable-line no-unused-vars
    const voiceChannel = message.member.voiceChannel;

    const noVoiceChannelEmbed = new MessageEmbed()
      .setAuthor("Error")
      .setDescription("You must be in a voice channel first!")
      .setColor(message.guild.me.roles.highest.color || 0x00AE86);

    const emptyQueueEmbed = new MessageEmbed()
      .setAuthor("Error")
      .setDescription("There is nothing playing!")
      .setColor(message.guild.me.roles.highest.color || 0x00AE86);

    const loopedEmbed = new MessageEmbed()
      .setAuthor("Looped")
      .setDescription(`The song has been looped by ${message.member.displayName}`)
      .setColor(message.guild.me.roles.highest.color || 0x00AE86);
      
    const unLoopedEmbed = new MessageEmbed()
      .setAuthor("Unlooped")
      .setDescription(`The song has been unlooped by ${message.member.displayName}`)
      .setColor(message.guild.me.roles.highest.color || 0x00AE86);

    const thisPlaylist = this.client.playlists.get(message.guild.id);

    if (!voiceChannel) return message.channel.send(noVoiceChannelEmbed);
    if (!this.client.playlists.has(message.guild.id)) return message.channel.send(emptyQueueEmbed);
    if (thisPlaylist.loop) {
      thisPlaylist.loop = false;
      return message.channel.send(unLoopedEmbed);
    } else {
      thisPlaylist.loop = true;
      return message.channel.send(loopedEmbed);
    }
  }
}

module.exports = Loop;