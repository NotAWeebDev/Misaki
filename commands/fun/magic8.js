const Social = require("../../base/Social.js");

class Magic8 extends Social {
  constructor(...args) {
    super(...args, {
      name: "magic8",
      description: "Answers a question, magic 8 ball style.",
      usage: "magic8 <question>?",
      category: "Fun",
      extended: "This Social will answer any question given to it in the style of a magic 8 ball.",
      cost: 5,
      aliases: ["8", "8ball"],
      loadingString: "<a:typing:397490442469376001> **{{me}}** is thinking..."
    });
    this.answers = [ "Maybe.", "Certainly not.", "I hope so.", "Not in your wildest dreams.", "There is a good chance.", "Quite likely.", "I think so.", "I hope not.", "I hope so.", "Never!", "Fuhgeddaboudit.", "Ahaha! Really?!?", "Pfft.", "Sorry, bucko.", "Hell, yes.", "Hell to the no.", "The future is bleak.", "The future is uncertain.", "I would rather not say.", "Who cares?", "Possibly.", "Never, ever, ever.", "There is a small chance.", "Yes!" ];
  }


  cmdVerify(message, args, loadingMessage) {
    if (!message.content.endsWith("?")) return Promise.reject(new this.client.methods.errors.UsageError("That does not look like a question, (hint, end your question with a `?`.)", loadingMessage));
    if (!args) return Promise.reject(new this.client.methods.errors.UsageError("You need to actually ask a question...", loadingMessage));
    return Promise.resolve();
  }

  async run(message, args, level, loadingMessage) { 
    setTimeout(
      () => loadingMessage.edit(`${this.answers[Math.floor(Math.random() * this.answers.length)]}`),
      Math.random() * (1 - 5) + 1 * 2000
    );
  }
}

module.exports = Magic8;