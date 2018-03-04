/* eslint linebreak-style: 0 */
const Command = require(`${process.cwd()}/base/Command.js`);
const { MessageEmbed } = require("discord.js");

class Queue extends Command {
  constructor(client) {
    super(client, {
      name: "queue",
      description: "This command will display all songs.",
      usage: "queue",
      category: "Music",
    });
  }

  async run(message, args, level) { // eslint-disable-line no-unused-vars
    const voiceChannel = message.member.voiceChannel;
    const thisPlaylist =  this.client.playlists.get(message.guild.id);

    const noVoiceChannelEmbed = new MessageEmbed()
      .setAuthor("Error")
      .setDescription("You must be in a voice channel first!")
      .setColor(message.guild.me.roles.highest.color || 0x00AE86);

    const emptyQueueEmbed = new MessageEmbed()
      .setAuthor("Error")
      .setDescription("There is nothing playing!")
      .setColor(message.guild.me.roles.highest.color || 0x00AE86);

    if (!voiceChannel) return message.channel.send(noVoiceChannelEmbed);
    if (!this.client.playlists.has(message.guild.id)) return message.channel.send(emptyQueueEmbed);
    const queueEmbed = new MessageEmbed()
      .setAuthor("Queue")
      .setDescription(`${thisPlaylist.songs.map(song => `**-** ${song.title}`).join("\n")}`)
      .setFooter(`Now playing: ${thisPlaylist.songs[0].title}`)      .setColor(message.guild.me.roles.highest.color || 0x00AE86);

    return message.channel.send(queueEmbed);
  }
}

module.exports = Queue;