const Social = require(`${process.cwd()}/base/Social.js`);

class Say extends Social {
  constructor(client) {
    super(client, {
      name: "say",
      description: "Make the bot say something.",
      usage: "say [#channel] <message>",
      category: "Fun",
      extended: "You can send a message to another channel via this command.",
      cost: 1,
      aliases: ["speak"],
      botPerms: ["MANAGE_MESSAGES"],
      permLevel: "Patron"
    });
  }

  async run(message, args, level) { // eslint-disable-line no-unused-vars
    if (args.length < 1) message.response(undefined, "You need to give the bot a message to send.");
    try {
      const channelid = await this.verifyChannel(message, args[0]);
      if (channelid !== message.channel.id) {
        args.shift();
      }
      const channel = message.guild.channels.get(channelid);
      if (!message.member.permissionsIn(channel).has(["SEND_MESSAGES", "READ_MESSAGES"])) message.response(undefined, "You do not have permission to `say` in that channel.");
      
      message.delete();
      const cost = this.cmdDis(this.help.cost, level);
      const payMe = await this.cmdPay(message, message.author.id, cost, this.conf.botPerms);
      if (!payMe) return;  

      channel.startTyping();
      setTimeout(() => {
        channel.send(args.join(" "));
        channel.stopTyping(true);
      }, 100 * args.join(" ").length / 2);
    } catch (error) {
      this.client.logger.error(error);
    }
  }
}

module.exports = Say;
