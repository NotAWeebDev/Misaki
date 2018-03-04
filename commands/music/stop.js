/* eslint linebreak-style: 0 */
const Command = require(`${process.cwd()}/base/Command.js`);
const { MessageEmbed } = require("discord.js");

class Stop extends Command {
  constructor(client) {
    super(client, {
      name: "stop",
      description: "This command will stop the current playing songs and clear the queue.",
      usage: "stop",
      category: "Music",
      permLevel: "Administrator"
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
      .setDescription("There is nothing to stop!")
      .setColor(message.guild.me.roles.highest.color || 0x00AE86);

    const stoppedEmbed = new MessageEmbed()
      .setAuthor("Stopped")
      .setDescription(`The song has been stopped by ${message.member.displayName}.`)
      .setColor(message.guild.me.roles.highest.color || 0x00AE86);

    if (!voiceChannel) return message.channel.send(noVoiceChannelEmbed);
    const thisPlaylist = this.client.playlists.get(message.guild.id);
    if (!this.client.playlists.has(message.guild.id)) return message.channel.send(emptyQueueEmbed);
    thisPlaylist.songs = [];
    thisPlaylist.connection.dispatcher.end();
    return message.channel.send(stoppedEmbed);
  }
}

module.exports = Stop;