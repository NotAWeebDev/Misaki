const Social = require("../../structures/Social.js");

class Vaportype extends Social {
  constructor(...args) {
    super(...args, {
      name: "vaportype",
      description: "Thie command will give you a one liner vaportype.",
      usage: "vaportype <text>",
      category: "Fun",
      cost: 5,
      loadingString: "<a:typing:397490442469376001> **{{displayName}}** is F E E L I N G  S P A C E D  O U T..."
    });
  }

  async run(message, args, level, loadingMessage) {
    if (!args.length) return message.reply("you have to provide me text to space out you baka."); // Test for any args.
    let msg = "";
    for (let i = 0; i < args.length; i++) msg += args[i].toUpperCase().split("").join(" ") + "  "; // Split up the arguments, then add to msg.
    loadingMessage.edit(msg);
  }
}

module.exports = Vaportype;
