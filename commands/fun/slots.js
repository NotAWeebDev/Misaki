const Social = require(`${process.cwd()}/base/Social.js`);

const { SlotMachine, SlotSymbol } = require("slot-machine");

const lemon = new SlotSymbol("lemon", { display: "🍋", points: 1, weight: 50 });

const watermelon = new SlotSymbol("watermelon", { display: "🍉", points: 5, weight: 10 });

const apple = new SlotSymbol("apple", { display: "🍎", points: 5, weight: 10 });

const grape = new SlotSymbol("grape", { display: "🍇", points: 5, weight: 10 });

const orange = new SlotSymbol("orange", { display: "🍊", points: 5, weight: 10 });

const cherry = new SlotSymbol("cherry", { display: "🍒", points: 5, weight: 10 });

const wild = new SlotSymbol("wild", { display: "❔", points: 2, weight: 10, wildcard: true });

const bell = new SlotSymbol("bell", { display: "🔔", points: 15, weight: 10 });

const clover = new SlotSymbol("clover", { display: "🍀", points: 20, weight: 7 });

const heart = new SlotSymbol("heart", { display: "❤", points: 30, weight: 6 });

const money = new SlotSymbol("money", { display: "💰", points: 40, weight: 5 });

const diamond = new SlotSymbol("diamond", { display: "💎", points: 50, weight: 4 });

const jackpot = new SlotSymbol("jackpot", {display: "🔅", points: 100, weight: 1});

const machine = new SlotMachine(3, [cherry, lemon, watermelon, apple, grape, orange, wild, bell, clover, heart, money, diamond, jackpot]);

class Slots extends Social {
  constructor(client) {
    super(client, {
      name: "slots",
      description: "Try your luck with the slots.",
      category: "Fun",
      usage: "slots",
      cost: 5,
      cooldown: 5,
      aliases: [],
      botPerms:["EMBED_LINKS"]
    });
  }
  
  async run(message, args, level) { // eslint-disable-line no-unused-vars
    if (!(await this.cmdPay(message, message.author.id, this.help.cost, this.conf.botPerms))) return;
    try {
      const results = machine.play();
      const winnings = results.totalPoints + this.help.cost;
      message.buildEmbed()
        .setAuthor("Okami Slots")
        .setColor(0x00F000)
        .setDescription(`${results.visualize(false)}\n\n${results.winCount === 0 ? `Oh rip, ${message.member.displayName} lost!` : `Whoa... ${message.member.displayName} won!`}\n\n${results.winCount === 0 ? "" : `${message.member.displayName} won ₲${winnings.toLocaleString()}`}`)
        .setTimestamp()
        .send();
      if (results.winCount > 0) return message.member.givePoints(winnings);
    } catch (e) {
      console.log(e);
    }
  }
}

module.exports = Slots;
