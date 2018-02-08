const Social = require(`${process.cwd()}/base/Social.js`);
const Discord = require("discord.js");
const snekfetch = require("snekfetch");
const h = new (require("html-entities").AllHtmlEntities)(); // HTML encoding decoder

class Trivia extends Social {
  constructor(client) {
    super(client, {
      name: "trivia",
      description: "Delivers a quiz with the correct answer awarding 10 points.",
      category: "Fun",
      usage: "trivia",
      extended: "Ready to wrack your brain?",
      cooldown: 10,
      aliases: ["quiz"]
    });
  }

  async run(message, args, level) { // eslint-disable-line no-unused-vars
    const { body } = await snekfetch.get("https://opentdb.com/api.php?amount=50&difficulty=medium&type=multiple"); // Grab the questions.
    const quiz = body.results.random(); // Get a random trivia question from a larger selection.
    const choices = quiz.incorrect_answers.map(answ => h.decode(answ)); // Insert all the incorrect answers to the choices array.
    choices.push(h.decode(quiz.correct_answer)); // Push the correct answer to the array as well.

    const randomChoices = new Array(4);
    for (let i = 0; i < 4; i++) {
      randomChoices[i] = choices.random(); // Select a random answer,
      choices.splice(choices.indexOf(randomChoices[i]), 1); // Remove it from the array.
    } // Repeat until complete

    const emb = new Discord.MessageEmbed() // Embed it
      .setAuthor("Misaki Trivia", this.client.user.displayAvatarURL())
      .setColor(message.guild.me.roles.highest.color || 5198940)
      .setDescription(h.decode(quiz.question))
      .addField("A", randomChoices[0])
      .addField("B", randomChoices[1])
      .addField("C", randomChoices[2])
      .addField("D", randomChoices[3])
      .setFooter(`Requested by: ${message.author.tag}`, message.author.displayAvatarURL({format: "png", size: 64}));

    const question = await this.client.awaitReply(message, null, m => m.author.id === message.author.id, 60000, {embed:emb}); // Ask the question.

    if (!question) return message.reply("you took too long to respond."); // Check against time it took. 1 Minute by default.
    const choice = randomChoices[["a", "b", "c", "d"].indexOf(question.toLowerCase())]; // Assign correct value to "choice" from randomChoices.
    if (!choice) return message.reply("that isn't a valid choice.."); // Check against incorrect values, correct is A, B, C and D.

    if (choice === h.decode(quiz.correct_answer)) { 
      message.member.givePoints(10); 
      return message.reply("that is correct! You won ₲10"); 
    }
    return message.reply(`That is Incorrect ! You Chose **${choice}** but The Correct Answer is, **${h.decode(quiz.correct_answer)}**`); // Throw if choice !== correct answer
  }
}

module.exports = Trivia;
