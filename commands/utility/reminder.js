const Command = require("../../structures/Command.js");
const timeRegex = /(?:^| )(?:in ?)?(((?:\d{1,2}(?:\.\d|\d)?)|a) ?((?:m(?:in(?:ute)?)?|h(?:our)?|d(?:ay)?|w(?:eek)?|m(?:onth)?|y(?:ear)?)s?))\b/gi;
const inputRegex = /(?:me ?)?(?:to ?)?(.*)/gi;
const aSomethingRegex = /\ba ?((?:m(?:in(?:ute)?)?|h(?:our)?|d(?:ay)?|w(?:eek)?|m(?:onth)?|y(?:ear)?)s?)\b/g;
const ms = require("ms");
const moment = require("moment");

class Reminder extends Command {
  constructor(...args) {
    super(...args, {
      name: "reminder",
      description: "Remind yourself with this command.",
      category: "Utilities",
      usage: "reminder [me] <reminder message>",
      extended: "Need to be reminded to take the trash out? This command can help!",
      aliases: ["remember", "remind", "reminders"]
    });
  }

  async run(message, [...text]) {
    if (!text.length) {
      const reminders = message.member.reminders;
      if (!reminders.length) return message.response(undefined, "You do not have any reminders set.");
      else return message.channel.send("**Your Reminders:**\n" + reminders.map(r => `${r.reminder} - ${moment(r.reminderTimestamp).fromNow()}`).join("\n"));
    }
    text = text.join(" ");
    const reminderInfo = this.regCheck(text);
    if (!reminderInfo) return message.response(undefined, "Invalid Command usage, you must supply a reminder message and duration e.g; `Do the laundry in 20 minutes`.");
    const [input, time] = reminderInfo;
    const reminderTimestamp = message.createdTimestamp + ms(time);
    this.client.reminders.set(`${message.author.id}-${reminderTimestamp}`, {
      id: message.author.id,
      guildid: message.guild.id,
      reminder: input,
      reminderTimestamp
    });

    return message.channel.send(`I will remind you to \`${input}\`, ${time} from now.`);
  }

  regCheck(reminder) {
    const remind = timeRegex.exec(reminder);
    if (!remind) return null;
    const time = remind[1].replace(/ ms?\b/, " min") //m => min
      .replace(aSomethingRegex, "1 $1").trim(); // a "something" => 1 "something"
    const input = inputRegex.exec(reminder)[1].replace(remind[0], "").trim();
    if (!input.length) return null;
    return [input, time];
  }
}

module.exports = Reminder;
