/* eslint linebreak-style: 0 */
const Command = require(`${process.cwd()}/base/Command.js`);
const { MessageEmbed } = require("discord.js");

class NP extends Command {
  constructor(client) {
    super(client, {
      name: "np",
      description: "This command will display the current playing song.",
      usage: "np",
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
      .setDescription("There is nothing playing!")
      .setColor(message.guild.me.roles.highest.color || 0x00AE86);

    const thisPlaylist = this.client.playlists.get(message.guild.id);
    const nowPlayingEmbed = new MessageEmbed()
      .setDescription(`**Now Playing:** ${thisPlaylist.songs[0].title}`)
      .setColor(message.guild.me.roles.highest.color || 0x00AE86);

    if (!voiceChannel) return message.channel.send(noVoiceChannelEmbed);
    if (!this.client.playlists.has(message.guild.id)) return message.channel.send(emptyQueueEmbed);
    return message.channel.send(nowPlayingEmbed);
  }
}

module.exports = NP;