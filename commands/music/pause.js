/* eslint linebreak-style: 0 */
const Command = require(`${process.cwd()}/base/Command.js`);
const { MessageEmbed } = require("discord.js");

class Pause extends Command {
  constructor(client) {
    super(client, {
      name: "pause",
      description: "This command will pause the current playing song.",
      usage: "pause",
      category: "Music",
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
      .setDescription("There is nothing to pause!")
      .setColor(message.guild.me.roles.highest.color || 0x00AE86);

    const pausedEmbed = new MessageEmbed()
      .setAuthor("Paused")
      .setDescription(`The song has been paused by ${message.member.displayName}.`)
      .setColor(message.guild.me.roles.highest.color || 0x00AE86);

    const alreadyPausedEmbed = new MessageEmbed()
      .setAuthor("Error")
      .setDescription("The song is already paused!")
      .setColor(message.guild.me.roles.highest.color || 0x00AE86);

    if (!voiceChannel) return message.channel.send(noVoiceChannelEmbed);
    const thisPlaylist = this.client.playlists.get(message.guild.id);
    if (!this.client.playlists.has(message.guild.id)) return message.channel.send(emptyQueueEmbed);
    if (!thisPlaylist.playing) return message.channel.send(alreadyPausedEmbed);
    thisPlaylist.playing = false;
    thisPlaylist.connection.dispatcher.pause();
    return message.channel.send(pausedEmbed);
  }
}

module.exports = Pause;