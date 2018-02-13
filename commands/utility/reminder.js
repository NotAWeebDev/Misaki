const Command = require(`${process.cwd()}/base/Command.js`);
const ms = require("ms");
const moment = require("moment");

class Reminder extends Command {
  constructor(client) {
    super(client, {
      name: "reminder",
      description: "Remind yourself with this command.",
      category: "Utilities",
      usage: "reminder [me] <reminder message>",
      extended: "Need to be reminded to take the trash out? This command can help!",
      aliases: ["remember", "remind", "reminders"]
    });
  }

  async run(message, args, level) { // eslint-disable-line no-unused-vars
    if (args.length === 0) {
      const reminders = message.member.reminders;
      if (reminders.length === 0) return message.response(undefined, "You do not have any reminders set.");
      else return message.channel.send("**Your Reminders:**\n" + reminders.map(r => `${r.reminder} - ${moment(r.reminderTimestamp).fromNow()}`).join("\n"));
    }
    const blah = await this.regCheck(args.join(" "));
    if (!blah) return message.respond(undefined, "Invalid Command usage, you must supply a reminder message and duration e.g; `Do the laundry in 20 minutes`.");
    this.client.reminders.set(`${message.author.id}-${message.createdTimestamp + ms(blah.split("#")[1])}`, {
      id: message.author.id,
      guildid: message.guild.id,
      reminder: blah.split("#")[0],
      reminderTimestamp: message.createdTimestamp + ms(blah.split("#")[1])
    });

    message.channel.send(`I will remind you to \`${blah.split("#")[0]}\`, ${blah.split("#")[1]} from now.`);
  }

  regCheck(reminder) {
    const remind = /(?:^| )(?:in ?)?(((?:\d{1,2}(?:\.\d|\d)?)|a) ?((?:m(?:in(?:ute)?)?|h(?:our)?|d(?:ay)?|w(?:eek)?|m(?:onth)?|y(?:ear)?)s?))\b/gi.exec(reminder);
    if (!remind) return false;
    const time = remind[1]
      .replace(/ ms?\b/, " min") //m => min
      .replace(/\ba ?((?:m(?:in(?:ute)?)?|h(?:our)?|d(?:ay)?|w(?:eek)?|m(?:onth)?|y(?:ear)?)s?)\b/g, "1 $1").trim(); // a "something" => 1 "something"
    const input = /(?:me ?)?(?:to ?)?(.*)/gi.exec(reminder)[1]
      .replace(remind[0], "").trim();
    if (input.length === 0) return false;
    return `${input}#${time}`;
  }
}

module.exports = Reminder;
