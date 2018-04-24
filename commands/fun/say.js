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


  async cmdVerify(message, args, loadingMessage) {
    let channelid;
    if (args.length < 1) throw new this.client.methods.errors.UsageError("You need to give the bot a message to send.", loadingMessage);
    message.mentions.channels.first() ? channelid = await this.verifyChannel(message, message.mentions.channels.first().id, { msg: loadingMessage }) : channelid = message.channel.id;

    const channel = message.guild.channels.get(channelid);
    if (!channel.permissionsFor(message.member).has(["SEND_MESSAGES", "VIEW_CHANNEL"])) throw new this.client.methods.errors.UsageError("You do not have permission to `say` in that channel.", loadingMessage);
    if (!channel.permissionsFor(message.guild.me).has(["SEND_MESSAGES", "VIEW_CHANNEL"])) throw new this.client.methods.errors.UsageError("I do not have permission to `say` in that channel.", loadingMessage);

    return channel;
  }

  async run(message, args, level, loadingMessage) {
    const channel = await this.cmdVerify(message, args, loadingMessage);

    await message.delete();
    message.mentions.channels.first() ? args.shift() : args;
    channel.startTyping();

    setTimeout(() => {
      channel.send(args.join(" "));
      channel.stopTyping(true);
    }, 100 * args.join(" ").length / 2);
  }
}

module.exports = Say;
