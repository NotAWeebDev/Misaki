const Social = require(`${process.cwd()}/base/Social.js`);

class Pay extends Social {
  constructor(client) {
    super(client, {
      name: "pay",
      description: "Pay another user your activity points.",
      usage: "pay <@mention|userid> <amount>",
      category: "Social",
      cost: 0,
      aliases: ["loan", "donate"],
      botPerms: []
    });
  }

  async run(message, args, level) { // eslint-disable-line no-unused-vars
    try {
      const user = await this.verifySocialUser(args[0]);
      if (isNaN(args[1])) throw "Not a valid amount";
      if (args[1] < 0) throw "You cannot pay less than zero, whatcha trying to do? rob em?";
      else if (args[1] < 1) throw "You paying 'em with air? boi don't make me slap you 👋";
      if (message.author.id === user) throw "You cannot pay yourself, why did you even try it?";

      await this.usrPay(message, message.author.id, user, parseInt(args[1]));
      // message.channel.send(points);
    } catch (error) {
      throw error;
    }
  }
}

module.exports = Pay;