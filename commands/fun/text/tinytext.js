const Social = require("../../../structures/Social.js");

class TinyText extends Social {
  constructor(...args) {
    super(...args, {
      name: "tinytext",
      description: "This command will shrink any given text.",
      usage: "tinytext [-tiny | -subscript | -superscript] <text>",
      category: "Fun",
      aliases: ["tiny", "tt"],
      cost: 5,
      loadingString: "<a:typing:397490442469376001> **{{displayName}}**, ᵢ ₛₕᵣᵤₙₖ ₜₕₑ ₜₑₓₜ!..."
    });
  }

  cmdVerify(message, args, loadingMessage) {
    if (args.length < 1) return Promise.reject(new this.client.methods.errors.UsageError("You have to provide me text to shrink you baka.", loadingMessage));
    return Promise.resolve();
  }

  async run(message, args, level, loadingMessage) {
    if (!message.flags.length) message.flags.push("tiny");
    loadingMessage.edit(await this.client.idiotAPI.tiny(args.join(" "), message.flags[0]));
  }
}

module.exports = TinyText;
