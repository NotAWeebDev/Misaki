/* eslint linebreak-style: 0 */
const Command = require(`${process.cwd()}/base/Command.js`);
const { MessageEmbed } = require("discord.js");
const ytapi = require("simple-youtube-api"); 
const youtube = new ytapi("YOUTUBE-API-KEY-HERE"); 
const handleVideo = require("../../modules/MusicHandling.js");

class Search extends Command {
  constructor(client) {
    super(client, {
      name: "search",
      description: "This command will allow a user to choose from 10 songs.",
      usage: "search <song-name>",
      category: "Music"
    });
  }

  async run(message, args, level) { // eslint-disable-line no-unused-vars
    const voiceChannel = message.member.voiceChannel;
    const noVoiceChannelEmbed = new MessageEmbed()
      .setAuthor("Error")
      .setDescription("You must be in a voice channel first!")
      .setColor(message.guild.me.roles.highest.color || 0x00AE86);
    if (!args[0]) {
      const embed = new MessageEmbed()
        .setAuthor("Error")
        .setDescription("Please list a song you would like to play")
        .setColor(message.guild.me.roles.highest.color || 0x00AE86);
      return message.channel.send(embed);
    }

    if (!voiceChannel) return message.channel.send(noVoiceChannelEmbed);
    const permissions = voiceChannel.permissionsFor(message.client.user);
    if (!permissions.has("CONNECT")) {
      const embed = new MessageEmbed()
        .setAuthor("Error")
        .setDescription("I cannot connect to your voice channel, make sure I have the proper permissions!")
        .setColor(message.guild.me.roles.highest.color || 0x00AE86);
      return message.channel.send(embed);
    }
    if (!permissions.has("SPEAK")) {
      const embed = new MessageEmbed()
        .setAuthor("Error")
        .setDescription("I cannot speak in this voice channel, make sure I have the proper permissions!")
        .setColor(message.guild.me.roles.highest.color || 0x00AE86);
      return message.channel.send(embed);
    }
    let video;
    try {
      const videos = await youtube.searchVideos(args.join(" "), 10);
      let index = 0;
      const embed = new MessageEmbed()
        .setAuthor("Song Selection")
        .setDescription(`${videos.map(video2 => `**${++index} -** ${video2.title}`).join("\n")}`)
        .setFooter("Please provide a value to select one of the search results ranging from 1-10.")
        .setColor(message.guild.me.roles.highest.color || 0x00AE86);
      message.channel.send(embed);
      let response;
      try {
        response = await message.channel.awaitMessages(msg2 => msg2.content > 0 && msg2.content < 11, {
          max: 1,
          time: 10000,
          errors: ["time"]
        });
      } catch (err) {
        const embed = new MessageEmbed()
          .setAuthor("Error")
          .setDescription("No or invalid value entered, cancelling video selection.")
          .setColor(message.guild.me.roles.highest.color || 0x00AE86);
        return message.channel.send(embed);
      }
      const videoIndex = parseInt(response.first().content);
      video = await youtube.getVideoByID(videos[videoIndex - 1].id);
    } catch (err) {
      const embed = new MessageEmbed()
        .setAuthor("Error")
        .setDescription("🆘 I could not obtain any search results.")
        .setColor(message.guild.me.roles.highest.color || 0x00AE86);
      return message.channel.send(embed);
    }
    return handleVideo(video, message, voiceChannel);
  }
}

module.exports = Search;
