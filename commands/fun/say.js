const Social = require("../../structures/Social.js");
const CHANNEL_REGEX = /<#(\d{17,19})>/g;

class Say extends Social {
  constructor(...args) {
    super(...args, {
      name: "say",
      description: "Make the bot say something.",
      usage: "say [-owo | -mock] [#channel] <message>",
      category: "Fun",
      extended: "You can send a message to another channel via this command.",
      cost: 5,
      aliases: ["speak"]
    });
  }

  async cmdVerify(message, args, loadingMessage) {
    let chan = CHANNEL_REGEX.exec(args);
    let response;
    if (!chan) chan = message.channel.id;
    else {
      chan = chan[1];
      response = args.join(" ").replace(CHANNEL_REGEX, "");
    }
    if (args.length < 1) throw new this.client.methods.errors.UsageError("You need to give a message to send dummy.", loadingMessage);
    const channel = message.guild.channels.get(chan);
    if (channel.permissionsFor(message.member).missing(["SEND_MESSAGES", "VIEW_CHANNEL"]).length) throw new this.client.methods.errors.UsageError("You don't have permission to `say` in that channel dummy.", loadingMessage);
    if (channel.permissionsFor(message.guild.me).missing(["SEND_MESSAGES", "VIEW_CHANNEL"]).length) throw new this.client.methods.errors.UsageError("I don't have permission to `say` in that channel baka.", loadingMessage);
    return [channel, response];
  }

  async run(message, args, level, loadingMessage) {
    const [channel, msg] = await this.cmdVerify(message, args, loadingMessage);
    const response = !msg ? args.join(" ") : msg;
    message.delete();

    channel.startTyping();
    setTimeout(async () => {
      switch (message.flags[0]) {
        case "owo":
          channel.send(await this.client.idiotAPI.owoify(response));
          break;
        case "mock":
          channel.send(await this.client.idiotAPI.mock(response));
          break;
          
        case "cancer":
          channel.send(await this.client.idiotAPI.mock(await this.client.idiotAPI.owoify(response)));
          break;

        default:
          channel.send(response);
          break;
      }
      channel.stopTyping(true);
    }, 100 * args.join(" ").length / 2);
  }
}

module.exports = Say;
