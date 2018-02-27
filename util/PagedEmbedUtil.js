const { MessageEmbed, Message, TextChannel } = require("discord.js");

const EMOJIS = {
  "1234": "🔢",
  right: "▶",
  forward: "▶",
  backward: "◀",
  left: "◀",
  up: "🔼",
  down: "🔽",
  play: "▶",
  pause: "⏸",
  square: "⏹",
  circle: "⏺",
  next: "⏭",
  prev: "⏮",
  right_double: "⏩",
  fast_forward: "⏩",
  left_double: "⏪",
  rewind: "⏪",
  up_double: "⏫",
  down_double: "⏬",
  point_right: "➡",
  right_arrow: "➡",
  point_left: "⬅",
  left_arrow: "⬅",
  point_up: "⬆",
  up_arrow: "⬆",
  point_down: "⬇",
  down_arrow: "⬇",
  up_right_arrow: "↗",
  point_up_right: "↗",
  down_right_arrow: "↘",
  point_down_right: "↘",
  down_left_arrow: "↙",
  point_down_left: "↙",
  up_left_arrow: "↖",
  point_up_left: "↖",
  hook_right: "↪",
  hook_left: "↩",
  arrow_clockwise: "🔃",
  reload: "🔃"
};

module.exports = class PagedEmbedUtil {
  constructor(msgOrChan) {

    this.pages = [];
    this.currentPage = 0;

    this.responseObj = {}; //object mapping emoji to action or function to be called, for example it might map ▶ to nextPage
    this.reactions = []; //array with emojis in order of how they should appear on the message

    if (msgOrChan instanceof Message) this.message = msgOrChan;
    else if (msgOrChan instanceof TextChannel) this.channel = msgOrChan;
    else throw new TypeError("Input must be a message or channel object!");
    // if its a TextChannel, the message will be sent with the first page when the pagedembed is executed.

  }

  addPage(embed) {
    this.pages.push(embed);
    return this;
  }

  addPages(embeds) {
    this.pages = this.pages.concat(embeds);
    return this;
  }

  useReaction(emoji, action) {
    this.reactions.push(emoji);
    if (typeof action === "string") {
      if (["nextpage", "next"].indexOf(action) !== -1) action = this.nextPage;
      if (["prevpage", "prev"].indexOf(action) !== -1) action = this.prevPage;
    }

    this.responseObj[emoji];
  }

  nextPage() {
    this.currentPage++;
    if (this.currentPage >= this.pages.length) this.currentPage = 0;
    return this.message.edit({ embed: this.pages[this.currentPage]});
  }

  prevPage() {
    this.currentPage--;
    if (this.currentPage < 0) this.currentPage = this.pages.length - 1;
    return this.message.edit({ embed: this.pages[this.currentPage]});
  }

  pageTo(page) {
    //...
  }

  async run() {
    if (!this.message) this.message = await this.channel.send({ embed: this.pages[this.currentPage] });

  }
};