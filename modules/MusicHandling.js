const { MessageEmbed, Util } = require("discord.js");
const ytdl = require("ytdl-core");

const handleVideo = async (video, message, voiceChannel, playlist = false) => {
  const queue = message.client.playlists; 
  const song = {
    id: video.id,
    title: Util.escapeMarkdown(video.title),
    url: `https://www.youtube.com/watch?v=${video.id}`,
    channel: video.channel.title,
    channelurl: `https://www.youtube.com/channel/${video.channel.id}`,
    durationh: video.duration.hours,
    durationm: video.duration.minutes,
    durations: video.duration.seconds,
    thumbnail: video.thumbnails.default.url,
    author: message.author.username,
    requesterid: message.author.id
  };
  if (!queue.has(message.guild.id)) {
    const queueConstruct = {
      textChannel: message.channel,
      voiceChannel: voiceChannel,
      connection: null,
      songs: [],
      volume: 5,
      playing: true,
      loop: false
    };
    queue.set(message.guild.id, queueConstruct);
    queueConstruct.songs.push(song);
    try {
      const connection = await voiceChannel.join();
      queueConstruct.connection = connection;
      play(message.guild, queueConstruct.songs[0]);
    } catch (error) {
      queue.delete(message.guild.id);
      const embed = new MessageEmbed()
        .setAuthor("Error")
        .setDescription(`An error has occured: ${error}`)
        .setColor(message.guild.me.roles.highest.color || 0x00AE86);
      return message.channel.send(embed);
    }
  } else {
    queue.get(message.guild.id).songs.push(song);
    if (playlist) return;
    else {
      const embed = new MessageEmbed()
        .setAuthor("Song added!")
        .setDescription(`✅ **${song.title}** has been added to the queue!`)
        .setColor(message.guild.me.roles.highest.color || 0x00AE86);
      return message.channel.send(embed);
    }
  }
  return;
}
  
function play(guild, song) {
  const queue = guild.client.playlists;
  const serverQueue = queue.get(guild.id);
  if (!song) {
    serverQueue.voiceChannel.leave();
    queue.delete(guild.id);
    return;
  }
  
  const dispatcher = queue.get(guild.id).connection.play(ytdl(song.url))
    .on("end", () => {
      if (!serverQueue.loop) {
        queue.get(guild.id).songs.shift();
        setTimeout(() => {
          play(guild, queue.get(guild.id).songs[0]);
        }, 250); 
      } else {
        setTimeout(() => {
          play(guild, queue.get(guild.id).songs[0]);
        }, 250);		   
      }
    });
  dispatcher.setVolumeLogarithmic(queue.get(guild.id).volume / 5);
  let songdurm, songdurh, songdurs;
  if (song.durationm < 10) songdurm = "0"+song.durationm;
  if (song.durationm >= 10) songdurm = song.durationm;
  if (song.durations < 10) songdurs = "0"+song.durations;
  if (song.durations >= 10) songdurs = song.durations;
  if (song.durationh < 10) songdurh = "0"+song.durationh;
  if (song.durationh >= 10) songdurh = song.durationh;
    
  const embed = new MessageEmbed()
    .setTitle(song.channel)
    .setURL(song.channelurl)
    .setThumbnail(song.thumbnail)
    .setDescription(`[${song.title}](${song.url})`)
    .addField("__Duration__",`${songdurh}:${songdurm}:${songdurs}`, true)
    .addField("__Requested by__", song.author, true)
    .setColor(guild.member(guild.client.user.id).roles.highest.color || 0x00AE86);
  if (!serverQueue.loop) return queue.get(guild.id).textChannel.send(embed);
}

module.exports = handleVideo;
