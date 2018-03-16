const Social = require("../../base/Social.js");

class Say extends Social {
  constructor(...args) {
    super(...args, {
      name: "say",
      description: "Make the bot say something.",
      usage: "say [#channel] <message>",
      category: "Fun",
      extended: "You can send a message to another channel via this command.",
      cost: 5,
      aliases: ["speak"]
    });
  }


  async cmdVerify(message, args, loadingMessage) {
    if (args.length < 1) throw new this.client.methods.errors.UsageError("You need to give the bot a message to send.", loadingMessage);
    const channelid = await this.verifyChannel(message, args[0], { msg: loadingMessage });
    if (channelid !== message.channel.id) {
      args.shift();
    }
    const channel = message.guild.channels.get(channelid);
    if (!message.member.permissionsIn(channel).has(["SEND_MESSAGES", "READ_MESSAGES"])) throw new this.client.methods.errors.UsageError("You do not have permission to `say` in that channel.", loadingMessage);
    return channel;
  }

  async run(message, args, level, loadingMessage) {
    const channel = await this.cmdVerify(message, args, loadingMessage);

    message.delete();

    channel.startTyping();
    setTimeout(() => {
      channel.send(args.join(" "));
      channel.stopTyping(true);
    }, 100 * args.join(" ").length / 2);
  }
}

module.exports = Say;
