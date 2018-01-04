const Social = require(`${process.cwd()}/base/Social.js`);

const { SlotMachine, SlotSymbol } = require("slot-machine");

const lemon = new SlotSymbol("lemon", { display: "🍋", points: 0, weight: 100 });

const cherry = new SlotSymbol("cherry", { display: "🍒", points: 5, weight: 100 });

const watermelon = new SlotSymbol("watermelon", { display: "🍉", points: 10, weight: 80 });

const bell = new SlotSymbol("bell", { display: "🔔", points: 15, weight: 70 });

const apple = new SlotSymbol("apple", { display: "🍎", points: 10, weight: 90 });

const grape = new SlotSymbol("grape", { display: "🍇", points: 10, weight: 85 });

const orange = new SlotSymbol("orange", { display: "🍊", points: 10, weight: 80 });

const wild = new SlotSymbol("wild", { display: "❔", points: 10, weight: 60, wildcard: true });

const clover = new SlotSymbol("clover", { display: "🍀", points: 100, weight: 50 });

const heart = new SlotSymbol("heart", { display: "❤", points: 300, weight: 30 });

const money = new SlotSymbol("money", { display: "💰", points: 400, weight: 20 });

const diamond = new SlotSymbol("diamond", { display: "💎", points: 500, weight: 10 });

const machine = new SlotMachine(3, [cherry, diamond, money, watermelon, bell, clover, lemon, apple, heart, grape, orange, wild]);

class Slots extends Social {
  constructor(client) {
    super(client, {
      name: "slots",
      description: "Try your luck with the slots.",
      category: "Fun",
      usage: "slots",
      cost: 5,
      cooldown: 10,
      aliases: [],
      botPerms:["EMBED_LINKS"]
    });
  }

  async run(message, args, level) { // eslint-disable-line no-unused-vars
    if (!(await this.cmdPay(message, message.author.id, this.cmdDis(this.help.cost, level), this.conf.botPerms))) return;
    try {
      const results = machine.play();
      message.buildEmbed()
        .setAuthor("Okami Slots")
        .setColor(0x00F000)
        .setDescription(`${results.visualize(false)}\n\n${results.winCount === 0 ? "Oh rip, you lost!" : "Whoa... you won!"}\n\n${results.winCount === 0 ? "" : `Points Won: ${results.totalPoints.toLocaleString()}`}`)
        .setTimestamp()
        .send();
      if (results.winCount > 0) return message.member.givePoints(results.totalPoints);
    } catch (e) {
      console.log(e);
    }
  }
}

module.exports = Slots;
