/* eslint linebreak-style: 0 */
const Command = require(`${process.cwd()}/base/Command.js`);
const { MessageEmbed } = require("discord.js");
const ytapi = require("simple-youtube-api"); 
const handleVideo = require("../../modules/MusicHandling.js");
const youtube = new ytapi("YOUTUBE-API-KEY-HERE"); 

class Play extends Command {
  constructor(client) {
    super(client, {
      name: "play",
      description: "This command will allow the bot to play a song.",
      usage: "play <url|song-name>",
      category: "Music",
    });
  }

  async run(message, args, level) { // eslint-disable-line no-unused-vars
    const url = args[0] ? args[0].replace(/<(.+)>/g, "$1") : "";
    if (!args[0]) {
      const embed = new MessageEmbed()
        .setAuthor("Error")
        .setDescription("Please list a song you would like to play")
        .setColor(message.guild.me.roles.highest.color || 0x00AE86);
      return message.channel.send(embed);
    }
    const voiceChannel = message.member.voiceChannel;
    if (!voiceChannel) {
      const embed = new MessageEmbed()
        .setAuthor("Error")
        .setDescription("I'm sorry but you need to be in a voice channel to play music!")
        .setColor(message.guild.me.roles.highest.color || 0x00AE86);
      return message.channel.send(embed);
    }
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
    if (url.match(/^https?:\/\/(www.youtube.com|youtube.com)\/playlist(.*)$/)) {
      const playlist = await youtube.getPlaylist(url);
      const videos = await playlist.getVideos();
      for (const video of Object.values(videos)) {
        const video2 = await youtube.getVideoByID(video.id); // eslint-disable-line no-await-in-loop
        await handleVideo(video2, message, voiceChannel, true); // eslint-disable-line no-await-in-loop
      }
      const embed = new MessageEmbed()
        .setAuthor("Playlist")
        .setDescription(`✅ Playlist: **${playlist.title}** has been added to the queue!`)
        .setColor(message.guild.me.roles.highest.color || 0x00AE86);
      message.channel.send(embed);
    } else {
      let video;
      try {
        video = await youtube.getVideo(url);
      } catch (error) {
        const videos = await youtube.searchVideos(args.join(" "), 1);
        video = await youtube.getVideoByID(videos[0].id);          
      }
      return handleVideo(video, message, voiceChannel);
    }
  }
}

module.exports = Play;
