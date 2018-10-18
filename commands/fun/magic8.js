const Social = require("../../structures/Social.js");

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
    this.answers = ["It is certain.",
      "It is decidedly so.",
      "Without a doubt.",
      "Yes - definitely.",
      "You may rely on it.",
      "As I see it, yes.",
      "Most likely.",
      "Outlook good.",
      "Yes.",
      "Signs point to yes.",
      "Reply hazy, try again",
      "Ask again later.",
      "Better not tell you now.",
      "Cannot predict now.",
      "Concentrate and ask again.",
      "Don't count on it.",
      "My reply is no.",
      "My sources say no.",
      "Outlook not so good.",
      "Very doubtful."];
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