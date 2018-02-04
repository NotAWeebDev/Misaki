const Social = require(`${process.cwd()}/base/Social.js`);

class Say extends Social {
  constructor(client) {
    super(client, {
      name: "say",
      description: "Make the bot say something.",
      usage: "say [#channel] <message>",
      category: "Fun",
      extended: "You can send a message to another channel via this command.",
      cost: 5,
      aliases: ["speak"]
    });
  }

  async run(message, args, level) { // eslint-disable-line no-unused-vars
    if (args.length < 1) message.response(undefined, "You need to give the bot a message to send.");
    const channelid = await this.verifyChannel(message, args[0]);
    if (channelid !== message.channel.id) {
      args.shift();
    }
    const channel = message.guild.channels.get(channelid);
    if (!message.member.permissionsIn(channel).has(["SEND_MESSAGES", "READ_MESSAGES"])) return message.response(undefined, "You do not have permission to `say` in that channel.");
      
    if (message.settings.socialSystem === "true") {
      if (!(await this.cmdPay(message, message.author.id, this.help.cost))) return;
    }
      
    message.delete();

    channel.startTyping();
    setTimeout(() => {
      channel.send(args.join(" "));
      channel.stopTyping(true);
    }, 100 * args.join(" ").length / 2);
  }
}

module.exports = Say;
