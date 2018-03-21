const Social = require("../../structures/Social.js");

class Pick extends Social {
  constructor(...args) {
    super(...args, {
      name: "pick",
      description: "Pick out of a list",
      category: "Fun",
      usage: "pick <option1>, <option2>, <option3>, <etc>",
      extended: "This command will help you select out of a list of supplied options.",
      cost: 5,
      aliases: ["choose"],
      loadingString: "<a:typing:397490442469376001> **{{me}}** is thinking..."
    });
  }

  cmdVerify(message, args, loadingMessage) {
    const options = args.join(" ");
    if (options.length < 2) return Promise.reject(new this.client.methods.errors.UsageError("Invalid command usage, you must supply text.", loadingMessage));
    const list = options.split(",");
    if (list.length < 2 || list[1] === "") return Promise.reject(new this.client.methods.errors.UsageError("Invalid command usage, you must supply at least two items to pick from.", loadingMessage));
    return Promise.resolve(list);
  }

  async run(message, args, level, loadingMessage) {
    const list = await this.cmdVerify(message, args, loadingMessage);
    setTimeout(
      () => loadingMessage.edit(`I think \`${list[Math.floor(Math.random()*list.length)].trim()}\``),
      Math.random() * (1 - 5) + 1 * 5000
    );
  }
}

module.exports = Pick;