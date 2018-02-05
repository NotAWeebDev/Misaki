const Social = require(`${process.cwd()}/base/Social.js`);

const { SlotMachine, SlotSymbol } = require("slot-machine");

const lemon = new SlotSymbol("lemon", { display: "🍋", points: 1, weight: 100 });
const watermelon = new SlotSymbol("watermelon", { display: "🍉", points: 1, weight: 100 });
const apple = new SlotSymbol("apple", { display: "🍎", points: 1, weight: 100 });
const grape = new SlotSymbol("grape", { display: "🍇", points: 1, weight: 100 });
const orange = new SlotSymbol("orange", { display: "🍊", points: 1, weight: 100 });
const cherry = new SlotSymbol("cherry", { display: "🍒", points: 1, weight: 100 });
const wild = new SlotSymbol("wild", { display: "❔", points: 1, weight: 40, wildcard: true });
const bell = new SlotSymbol("bell", { display: "🔔", points: 2, weight: 40 });
const clover = new SlotSymbol("clover", { display: "🍀", points: 3, weight: 35 });
const heart = new SlotSymbol("heart", { display: "❤", points: 4, weight: 30 });
const money = new SlotSymbol("money", { display: "💰", points: 5, weight: 25 });
const diamond = new SlotSymbol("diamond", { display: "💎", points: 10, weight: 3 });
const jackpot = new SlotSymbol("jackpot", { display: "🔅", points: 50, weight: 5});

const machine = new SlotMachine(3, [cherry, lemon, watermelon, apple, grape, orange, wild, bell, clover, heart, money, diamond, jackpot]);

class Slots extends Social {
  constructor(client) {!
    super(client, {
      name: "slots",
      description: "Try your luck with the slots.",
      category: "Fun",
      usage: "slots",
      cost: 10,
      cooldown: 5,
    });
  }
  
  async run(message, args, level) { // eslint-disable-line no-unused-vars
    if (message.settings.socialSystem !== "true") return message.response(undefined, "The social system has been disabled.");
  
    if (!(await this.cmdPay(message, message.author.id, this.help.cost))) return;
  
    try {
      const results = machine.play();
      const winnings = this.help.cost * results.totalPoints;
      message.buildEmbed()
        .setColor(message.guild.me.roles.highest.color || 5198940)
        .setAuthor("Misaki Slots")
        .setDescription(`${results.visualize(false)}\n\n${results.winCount === 0 ? `${message.member.displayName} has lost!\nBetter luck next time!` : `Whoa... ${message.member.displayName} won!`}\n\n${results.winCount === 0 ? "" : `You have won ₲${winnings.toLocaleString()}`}`)
        .setTimestamp()
        .send();
      if (results.winCount > 0) return message.member.givePoints(winnings);
    } catch (e) {
      console.log(e);
    }
  }
}

module.exports = Slots;
