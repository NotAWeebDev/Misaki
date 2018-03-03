const Social = require(`${process.cwd()}/base/Social.js`);
const { get } = require("snekfetch");
const peutil = require("../../util/PagedEmbedUtil.js");
class XKCD extends Social {
  constructor(client) {
    super(client, {
      name: "xkcd",
      description: "Get the daily comic from XKCD",
      category: "Fun",
      usage: "xkcd [num] [-i]",
      extended: "Get a random comic, type an ID number to get a specific comic, or type -i to flick through random comics with a paged embed.",
      cost: 10,
      cooldown: 10
    });
  }

  async init() {
    const inf = await get("https://xkcd.com/info.0.json");
    this.info = inf.body;
  }

  async run(message, args, level) { // eslint-disable-line no-unused-vars
    
    let embed;
    if (args[0]) {
      embed = await this.getPage(args[0], message);
    } else {
      embed = await this.random();
    }
    if (message.flags[0] !== "i") return message.channel.send({embed});

    const pagedEmbed = new peutil({caller: message.member, channel: message.channel}).addPage(embed);
    pagedEmbed
      .useReaction(peutil.EMOJIS.left, () => pagedEmbed.prevPage(false))
      .useReaction(peutil.EMOJIS.right, async () => {
        pagedEmbed.addPage(await this.random())
          .nextPage();
      }).useReaction(peutil.EMOJIS.red_cross, () => pagedEmbed.end())
      .run();


  }

  async random() {
    const rn = await this.client.randomNum(1, this.info.num);
    const ef = await get(`https://xkcd.com/${rn}/info.0.json`);
    const ab = ef.body;
    return {author:{name:"Misaki | XKCD Comics"}, description:`${ab.title} | #${ab.num}\n${ab.alt}`, image:{url:ab.img}};
  }

  async getPage(page, message) {
    if (!page) return message.reply(`Please make a selection between 1 - ${this.info.num}`);
    if (page.isNumber() !== true) return message.reply("Please make a numerical selection.");
    if (page > this.info.num || page <= 0) return message.reply(`Please make a selection between 1 - ${this.info.num}`);
    const ef = await get(`https://xkcd.com/${page}/info.0.json`);
    const ab =  ef.body;
    
    return {author:{name:"Misaki | XKCD Comics"}, description:`${ab.title} | #${ab.num}\n${ab.alt}`, image:{url:ab.img}};
  }
}

module.exports = XKCD;
