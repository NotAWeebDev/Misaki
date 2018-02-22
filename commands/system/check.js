const Command = require(`${process.cwd()}/base/Command.js`);
class Ready extends Command {
  constructor(client) {
    super(client, {
      name: "check",
      description: "Check if Misaki has the required permissions.",
      usage: "check",
      category: "check"
    });
  }

  async run(message, args, level) { // eslint-disable-line no-unused-vars
    message.channel.send(`${message.guild.me.permissions.has("EMBED_LINKS") ? ":white_check_mark: ║ I have the ability to Embed Links." : ":negative_squared_cross_mark: ║ I do **not** have the ability to Embed Links."}\n\n${message.guild.me.permissions.has("MANAGE_MESSAGES") ? ":white_check_mark: ║ I have the ability to Manage Messages." : ":negative_squared_cross_mark: ║ I do **not** have the ability to Manage Messages."}\n\n${message.guild.me.permissions.has("ADD_REACTIONS") ? ":white_check_mark: ║ I have the ability to Add Reactions." : ":negative_squared_cross_mark: ║ I do **not** have the ability to Add Reactions."}\n\n${!message.guild.me.permissions.has(["EMBED_LINKS","MANAGE_MESSAGES","ADD_REACTIONS"]) ? "Misaki is missing a few permissions, some commands may not work properly if these permissions are missing." : "Misaki has all the permissions that are currently required for flawless operation!"}`);}
}

module.exports = Ready;
