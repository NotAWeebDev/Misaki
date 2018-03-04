const Command = require(`${process.cwd()}/base/Command.js`);
class Announcements extends Command {
  constructor(client) {
    super(client, {
      name: "announcements",
      description: "Get bot related announcements.",
      usage: "announcements",
      category: "General",
      aliases: ["announce", "news"]
    });
  }

  async run(message, args, level) { // eslint-disable-line no-unused-vars
    try {
      const guild = this.client.guilds.get("396331425621868554");
      const channel = guild.channels.get("411273277718396938");
      const messages = await channel.messages.fetch({limit:5});
      const announcement = messages.first();

      const embed = this.client.methods.Embed()
        .setTitle("Bot announcement!")
        .setAuthor(announcement.author.username, announcement.author.displayAvatarURL({ format:"png", size:32 }))
        .setDescription(announcement.cleanContent)
        .setThumbnail(announcement.author.displayAvatarURL({ format:"png", size:512 }))
        .setTimestamp(new Date(announcement.createdTimestamp));
      message.channel.send({ embed });
    } catch (e) {
      console.log(e);
    }
  }
}

module.exports = Announcements;
