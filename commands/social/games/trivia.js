const Social = require("../../../structures/Social.js");
const { get } = require("snekfetch");
const h = new (require("html-entities").AllHtmlEntities)(); // HTML encoding decoder/cleaner
const { MessageEmbed } = require("discord.js");

class Trivia extends Social {
  constructor(...args) {
    super(...args, {
      name: "trivia",
      description: "Delivers a quiz with the correct answer awarding 10 points.",
      category: "Fun",
      usage: "trivia",
      extended: "Ready to wrack your brain?",
      cost: 5,
      cooldown: 10,
      aliases: ["quiz"]
    });
  }

  async run(message, args, level) { // eslint-disable-line no-unused-vars
    const { body } = await get("https://opentdb.com/api.php?amount=50&difficulty=medium&type=multiple"); // Grab the questions.
    const quiz = body.results.random(); // Get a random trivia question from a larger selection.
    const choices = quiz.incorrect_answers.map(answ => h.decode(answ)); // Insert all the incorrect answers to the choices array.
    choices.push(h.decode(quiz.correct_answer)); // Push the correct answer to the array as well.

    const randomChoices = new Array(4);
    for (let i = 0; i < 4; i++) {
      randomChoices[i] = choices.random(); // Select a random answer,
      choices.splice(choices.indexOf(randomChoices[i]), 1); // Remove it from the array.
    } // Repeat until complete

    const emb = new MessageEmbed()
      .setAuthor("Misaki Trivia", this.client.user.displayAvatarURL())
      .setColor(message.guild.me.roles.highest.color || 5198940)
      .setDescription(`${h.decode(quiz.question)}\nA: **${randomChoices[0]}**\nB: **${randomChoices[1]}**\nC: **${randomChoices[2]}**\nD: **${randomChoices[3]}**`)
      .setFooter(`Requested by: ${message.author.tag}`, message.author.displayAvatarURL({format: "png", size: 64}));

    const question = await message.awaitReply(emb, m => m.author.id === message.author.id && ["a","b","c","d"].includes(m.content.toLowerCase()), 60000); // Ask the question.
    const msg = question[1]; // The question Embed.

    if (!question[0]) return message.reply("I'm sorry but you took too long to respond."); // Check against time it took. 1 Minute by default.
    const choice = randomChoices[["a", "b", "c", "d"].indexOf(question[0].toLowerCase())]; // Assign correct value to "choice" from randomChoices.
    
    if (choice === h.decode(quiz.correct_answer)) { 
      message.member.givePoints(this.cost * 3); // Give the user their points.
      return msg.edit(msg.embeds[0].setColor(383744).setAuthor("Misaki Trivia; Correct! You won ₲15")); // Modify the Embed to show that they won.
      //return message.reply(`That is correct! You won ₲${this.cost * 3}`); 
    }
    return msg.edit(msg.embeds[0].setColor(11862273).setAuthor(`Misaki Trivia; Incorrect, the correct answer was: ${h.decode(quiz.correct_answer)}`)); // Modify the Embed to show they lost.
    // message.reply(`The correct answer was: **${h.decode(quiz.correct_answer)}**, but you selected **${choice}**.`); // Throw if choice !== correct answer
  }
}

module.exports = Trivia;
