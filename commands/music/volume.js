/* eslint linebreak-style: 0 */
const Command = require(`${process.cwd()}/base/Command.js`);
const { MessageEmbed } = require("discord.js");

class Volume extends Command {
  constructor(client) {
    super(client, {
      name: "volume",
      description: "This command will set the volume of the songs.",
      usage: "volume [number]",
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
      .setDescription("There is nothing playing!")
      .setColor(message.guild.me.roles.highest.color || 0x00AE86);

    const errorVolumeEmbed = new MessageEmbed()
      .setAuthor("Error")
      .setDescription("Volume must be a value between 0 and 100.")
      .setColor(message.guild.me.roles.highest.color || 0x00AE86);

    if (!voiceChannel) return message.channel.send(noVoiceChannelEmbed);
    if (!this.client.playlists.has(message.guild.id)) return message.channel.send(emptyQueueEmbed);

    const currentVolumeEmbed = new MessageEmbed()
      .setAuthor("Volume")
      .setDescription(`Current volume is ${this.client.playlists.get(message.guild.id).connection.dispatcher.volumeLogarithmic * 100}%`)
      .setColor(message.guild.me.roles.highest.color || 0x00AE86);
    if (!args[0]) return message.channel.send(currentVolumeEmbed);

    if (Number(args[0]) < 0 || Number(args[0]) > 100) return message.channel.send(errorVolumeEmbed);
    message.guild.voiceConnection.volume = Number(args[0]) / 100;
    this.client.playlists.get(message.guild.id).volume = Number(args[0]);
    this.client.playlists.get(message.guild.id).connection.dispatcher.setVolumeLogarithmic(Number(args[0]) / 100);
    
    const volumeSetEmbed = new MessageEmbed()
      .setAuthor("Volume")
      .setDescription(`Volume has been set to ${args[0]}%`)
      .setColor(message.guild.me.roles.highest.color || 0x00AE86);
    message.channel.send(volumeSetEmbed);

  }
}

module.exports = Volume;