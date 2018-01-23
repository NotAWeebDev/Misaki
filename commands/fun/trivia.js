const Social = require(`${process.cwd()}/base/Social.js`);
const Discord = require("discord.js");
const snek = require("snekfetch");
const B64 = require("base-64");
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

    const inf = await snek.get("https://opentdb.com/api.php?amount=10&category=9&difficulty=medium&type=multiple&encode=base64");
    const ob = await inf.body;
    const emb = new Discord.MessageEmbed();
    var a;
    var b;
    var c;
    var d;
    var choice;
    const questions = [];

    ob.results[0].incorrect_answers.forEach(ob => questions.push(B64.decode(ob)));
    questions.push(B64.decode(ob.results[0].correct_answer));
    
    a = await questions.random();
    questions.splice(questions.indexOf(a), 1);
    b = questions.random();
    questions.splice(questions.indexOf(b), 1);
    c = questions.random();
    questions.splice(questions.indexOf(c), 1);
    d = questions[0];

    emb.setAuthor("Misaki Trivia", this.client.user.displayAvatarURL());
    emb.setDescription(B64.decode(ob.results[0].question).replace(/â/g,"").replace(/â/g,""));
    emb.setColor("#FC963B");
    emb.addField("A", a);
    emb.addField("B", b);
    emb.addField("C", c);
    emb.addField("D", d);

    const question = await this.client.awaitReply(message, null, m => m.author.id === message.author.id, 60000, {embed:emb});
    
    if (question === false) return message.reply("you took too long to respond.");
    if (question.toLowerCase() === "a") choice = a;
    if (question.toLowerCase() === "b") choice = b;
    if (question.toLowerCase() === "c") choice = c;
    if (question.toLowerCase() === "d") choice = d;
    if (!["a", "b", "c", "d"].includes(question.toLowerCase())) return message.reply("that isn't a valid choice..");
    
    if (choice === B64.decode(ob.results[0].correct_answer)) { 
      message.member.givePoints(10); return message.reply(`that is correct! You won 10${message.settings.uEmoji}`); 
    } else { 
      return message.reply("that is incorrect!"); 
    }
  
  }
}

module.exports = Trivia;
