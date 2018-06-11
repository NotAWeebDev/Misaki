const Social = require("../../../structures/Social.js");

class Vaportype extends Social {
  constructor(...args) {
    super(...args, {
      name: "vaportype",
      description: "This command will space out your text.",
      usage: "vaportype <text>",
      category: "Fun",
      aliases: ["vapor"],
      cost: 5,
      loadingString: "<a:typing:397490442469376001> **{{displayName}}** ＩＳ ＦＥＥＬＩＮＧ ＳＰＡＣＥＤ ＯＵＴ..."
    });
  }

  cmdVerify(message, args, loadingMessage) {
    if (args.length < 1) return Promise.reject(new this.client.methods.errors.UsageError("You have to provide me text to space out you baka.", loadingMessage));
    return Promise.resolve();
  }

  async run(message, args, level, loadingMessage) {
    loadingMessage.edit(await this.client.idiotAPI.vapor(args.join(" ").toUpperCase()));
  }
}

module.exports = Vaportype;
