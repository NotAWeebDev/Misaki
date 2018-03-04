/* eslint linebreak-style: 0 */
const Command = require(`${process.cwd()}/base/Command.js`);
const { MessageEmbed } = require("discord.js");

class Skip extends Command {
  constructor(client) {
    super(client, {
      name: "skip",
      description: "This command will skip a current playing song.",
      usage: "skip",
      category: "Music",
      aliases: ["next"],
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
      .setDescription("There is nothing to skip!")
      .setColor(message.guild.me.roles.highest.color || 0x00AE86);

    const skippedEmbed = new MessageEmbed()
      .setAuthor("Skipped")
      .setDescription(`The song has been skipped by ${message.member.displayName}.`)
      .setColor(message.guild.me.roles.highest.color || 0x00AE86);

    if (!voiceChannel) return message.channel.send(noVoiceChannelEmbed);
    if (!this.client.playlists.has(message.guild.id)) return message.channel.send(emptyQueueEmbed);
    const thisPlaylist = this.client.playlists.get(message.guild.id);
    thisPlaylist.loop = false;
    thisPlaylist.connection.dispatcher.end("skip");
    return message.channel.send(skippedEmbed);
  }
}

module.exports = Skip;