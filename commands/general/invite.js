const Command = require(`${process.cwd()}/base/Command.js`);
class Invite extends Command {
  constructor(client) {
    super(client, {
      name: "invite",
      description: "Invite me to your guild!",
      usage: "invite",
      aliases: []
    });
  }

  async run(message, args, level) { // eslint-disable-line no-unused-vars
    try {
      message.buildEmbed()
        .setColor(message.guild.member(this.client.user.id).highestRole.color || 0)
        .addField("Invite Me", "If you want to add me to your guild, you can do so by grabbing my invite code from [here](https://discordapp.com/oauth2/authorize/?permissions=268755008&scope=bot&client_id=396323622953680910)")
        .addField("Okami Academy", "If you need help setting me up, you can join the [Okami Academy](https://discord.gg/RasxyYT) to get help with getting me ready on your guild!")
        .send();

    } catch (e) {
      console.log(e);
    }
  }
}

module.exports = Invite;
