const Social = require(`${process.cwd()}/base/Social.js`);
const Discord = require("discord.js");
const html = require("html-entities").AllHtmlEntities;
const snek = require("snekfetch");
const h = new html();

class Trivia extends Social {
  constructor(client) {
    super(client, {
      name: "trivia",
      description: "Delivers a quiz with the correct answer awarding 10 points.",
      category: "Fun",
      usage: "trivia",
      extended: "Ready to wrack your brain? ",
      cooldown: 10,
      aliases: ["quiz"],
      botPerms: ["EMBED_LINKS"]
    });
  }

  async run(message, args, level) { // eslint-disable-line no-unused-vars
    const { body } = await snek.get("https://opentdb.com/api.php?amount=50&difficulty=medium&type=multiple"); // Grab the questions.
    const quiz = body.results.random(); // Get a random trivia question from a larger selection.
    const choices = quiz.incorrect_answers.map(answ => h.decode(answ)); // Insert all the incorrect answers to the choices array.
    choices.push(h.decode(quiz.correct_answer)); // Push the correct answer to the array as well.
    
    const randomChoices = [];
    for (let i = 0; i < 4; i++) {
      randomChoices[i] = choices.random(); // Select a random answer,
      choices.splice(choices.indexOf(randomChoices[i]), 1); // Remove it from the array.
    } // Repeat until complete
    const [a, b, c, d] = randomChoices;

    const emb = new Discord.MessageEmbed() // Embed it
      .setAuthor("Misaki Trivia", this.client.user.displayAvatarURL())
      .setColor("#FC963B")
      .setDescription(h.decode(quiz.question))
      .addField("A", a)
      .addField("B", b)
      .addField("C", c)
      .addField("D", d);

    const question = await this.client.awaitReply(message, null, m => m.author.id === message.author.id, 60000, {embed:emb}); // Ask the question.

    let choice;
    if (!question) return message.reply("you took too long to respond.");
    if (!/^(a|b|c|d)$/i.test(question)) return message.reply("that isn't a valid choice..");
    switch (question.toLowerCase()) {
      case "a":
        choice = a;
        break;
      case "b":
        choice = b;
        break;
      case "c":
        choice = c;
        break;
      case "d":
        choice = d;
        break;
    }
    
    if (choice === quiz.correct_answer) { 
      message.member.givePoints(10); 
      return message.reply(`that is correct! You won 10${message.settings.uEmoji}`); 
    } else { 
      return message.reply("that is incorrect!"); 
    }
  
  }
}

module.exports = Trivia;
