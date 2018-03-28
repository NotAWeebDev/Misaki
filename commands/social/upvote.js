const Social = require(`${process.cwd()}/base/Social.js`);
const {
  get
} = require("snekfetch");
const upvoterRole = "410531245504593920";

class Upvote extends Social {
  constructor(client) {
    super(client, {
      name: "upvote",
      description: "Claim your upvoter rewards.",
      usage: "upvote",
      category: "Social",
      extended: "This command will check your upvoter status.",
      cost: 0,
      cooldown: 5
    });
  }

  async run(message, args, level) { // eslint-disable-line no-unused-vars
    if (message.guild.id !== "396331425621868554") return message.reply(`This command can only be used in Okami Academy, run ${message.settings.prefix}invite to get the invite link.`);
    const { body } = await get(`https://discordbots.org/api/bots/${this.client.user.id}/check?userId=${message.author.id}`).set("Authorization", process.env.DBLTOKEN);
    if (Boolean(body.voted)) { // eslint-disable-line no-extra-boolean-cast
      if (message.member.roles.has(upvoterRole)) return message.channel.send("You have the role already.");
      message.member.roles.add(upvoterRole)
        .then(() => message.reply("You have been awarded the `Updooter` role, thank you for your support.\nDon't forget to revote next month!"))
        .catch((error) => {
          console.log(error);
          message.channel.send("Something went wrong, please try again later.");
        });
    } else {
      message.channel.send(`To claim the \`Updooter\` to show your support, please go upvote ${this.client.user.username} at <https://discordbots.org/bot/misaki>, then after voting return and run the command again to claim your role reward.`);
    }
  }
}

module.exports = Upvote;