const Social = require("../../structures/Social.js");

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

  async run(message, [channel, ...msg], level, loadingMessage) {

    if (!channel || msg.length < 1) throw new this.client.methods.errors.UsageError("You need to give the bot a message to send.", loadingMessage);
    msg = msg.join(" ");

    const channelid = await this.verifyChannel(message, channel, { msg: loadingMessage });
    if (channelid === message.channel.id) msg = channel + " " + msg;    
    const chn = message.guild.channels.get(channelid);
    if (chn.permissionsFor(message.guild.me).missing(["SEND_MESSAGES", "READ_MESSAGES"]).length > 0) throw new this.client.methods.errors.UsageError("I do not have permission to `say` in that channel.", loadingMessage);
    if (chn.permissionsFor(message.member).missing(["SEND_MESSAGES", "READ_MESSAGES"]).length > 0) throw new this.client.methods.errors.UsageError("You do not have permission to `say` in that channel.", loadingMessage);
    
    message.delete();

    chn.startTyping();
    setTimeout(() => {
      chn.send(msg);
      chn.stopTyping(true);
    }, 100 * msg.length / 2);
  }
}

module.exports = Say;
