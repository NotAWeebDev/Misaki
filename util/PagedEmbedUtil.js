const { MessageEmbed, GuildMember, User} = require("discord.js");

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
  reload: "🔃",
  exclamation: "❕",
  red_exclamation: "❗",
  check: "✔",
  green_check: "✅",
  cross: "✖",
  red_cross: "❌"

};

/**
 * A utility that manages paged embeds.
 */

const peutil = class PagedEmbedUtil {
  /**
   * @typedef {object} PagedEmbedUtilOptions
   * @property {User} [caller] The user who instantiated the command.
   * @property {Message} [message] The message to edit with the paged embed. If there is no message,
   * it will send a message instead.
   * @property {Text}
   */
  /**
   * @param {PagedEmbedUtilOptions} options 
   */
  constructor(options = {}) {

    this.pages = [];
    this.currentPage = 0;

    this.responseMap = new Map(); //map, mapping emoji to action or function to be called, for example it might map ▶ to nextPage
    this.reactions = []; //array with emojis in order of how they should appear on the message

    this.message = options.message || null; 
    this.channel = options.channel || null;
    // if its a TextChannel, the message will be sent with the first page when the pagedembed is executed.

    const caller = options.caller;
    if (caller instanceof GuildMember) this.caller = caller;
    if (caller instanceof User) this.caller = this.channel.guild.member(caller);
    if (typeof caller === "string") this.caller = this.channel.guild.members.get(caller);
    if (!caller) throw new TypeError("Option \"caller\" must be the member or user who instantiated the command");

    this.collector = null;
    this.collectorOptions = options.collectorOptions || {}; 
  }

  addPage(embed) {
    this.pages.push(embed);
    return this;
  }

  addPages(embeds) {
    this.pages = this.pages.concat(embeds);
    return this;
  }

  setPages(embeds) {
    this.pages = embeds;
    return this;
  }

  clearPages() {
    this.pages = [];
    return this;
  }

  useReaction(emoji, action) {
    const position = this.reactions.indexOf(emoji);
    if (position !== -1) this.reactions.splice(position, 1);
    this.reactions.push(emoji);
    if (typeof action === "string") {
      if (["nextpage", "next"].indexOf(action) !== -1) action = this.nextPage.bind(this);
      if (["prevpage", "prev"].indexOf(action) !== -1) action = this.prevPage.bind(this);
      if (["prompt", "goto", "gotopage", "ask"].indexOf(action) !== -1) action = this.createPrompt.bind(this);
    }
    this.responseMap.set(emoji, action);
    return this;
  }

  clearReactions() {
    this.responseMap.clear();
    this.reactions = [];
    return this;
  }

  reapplyReactions() {
    const perms = this.channel.permissionsFor(this.channel.guild.me).has("MANAGE_REACTIONS");
    if (perms) this.message.reactions.removeAll();
    else this.message.reactions.map(r => r.users.remove());
  }

  end() {
    const perms = this.channel.permissionsFor(this.channel.guild.me).has("MANAGE_REACTIONS");
    if (perms) this.message.reactions.removeAll();
    else this.message.reactions.map(r => r.users.remove());
    this.collector.stop();
  }

  nextPage(overlap = true) {
    this.currentPage++;
    if (this.currentPage >= this.pages.length) this.currentPage = overlap ?  0: this.pages.length - 1;
    return this._update();
  }

  prevPage(overlap = true) {
    this.currentPage--;
    if (this.currentPage < 0) this.currentPage = overlap ? this.pages.length - 1 : 0;
    return this._update();
  }

  pageTo(page) {
    if (typeof page === "string") page = Number(page);
    if (!Number.isInteger(page)) throw new TypeError("Argument must be an integer");
    page--; // users will assume its 1-indexed and not 0-indexed
    if (page < 0 || page >= this.pages.length) throw new RangeError("Out of page range");
    this.currentPage = page;
    return this._update();
  }

  prompt() {
    this.channel.client.awaitReply(this.message, "What page do you want to see? (Say `cancel` to cancel this prompt)", m => m.author.id === this.caller.user.id, undefined, null)
      .then(response => {
        if (response.toLowerCase().trim() === "cancel") return;
        const page = Number(response);
        if (isNaN(page)) return this.channel.send("That is not a valid response.");
        return this.pageTo(page).catch(() => this.channel.send("That page does not exist."));
      });
  }

  async run() {
    if (!this.message) {
      const embed = this.pages[this.currentPage];
      if (!embed) return;
      embed.footer = {
        text: `${this.currentPage + 1}/${this.pages.length}` 
      };
      this.message = await this.channel.send({ embed: this.pages[this.currentPage] });
    }
    for (const emoji of this.reactions) {
      await this.message.react(emoji);
    }

    this.collector = this.message.createReactionCollector((reaction, user) => user === this.caller.user && this.reactions.indexOf(reaction.emoji.name) !== -1, {time: 15 * 60 * 1000});

    this.collector.on("collect", r => {
      const perms = this.channel.permissionsFor(this.channel.guild.me).has("MANAGE_REACTIONS");
      if (perms) r.users.remove(this.caller.user);
      const cb = this.responseMap.get(r.emoji.name);
      if (cb) cb();
    });

    this.collector.on("end", () => this.end);
  }

  _update() {
    const embed = this.pages[this.currentPage];
    if (!embed) return;
    embed.footer = {
      text: `${this.currentPage + 1}/${this.pages.length}` 
    };
    return this.message.edit({ embed });
  }

  static splitFields(string, splitRegex = /(\n|\.)/,embed, perPage = 10, fieldTitle = "\u200b") {
    if (typeof splitRegex === "string") splitRegex = new RegExp(`(${splitRegex})`);
    const split = string.split(splitRegex).reduce((acc, b, i) => {//first iteration of i is 0
      if (i % 2 === 0) acc.push(b);
      else acc[acc.length - 1] += b;
      return acc;
    }, [""]).reduce((acc, b, i) => {
      if (i % perPage === 0) acc.push(b);
      else if (acc[acc.length - 1].length + b.length > 1020) acc.push(b);
      else acc[acc.length - 1] += b;
      return acc;
    }, [""]).filter(a => /[^\n\s]+/.test(a));

    if (!embed) return split;
    console.log(split);
    return split.map(e => this.cloneEmbed(embed).addField(fieldTitle, e));

  }

  static cloneEmbed(embed) {
    return Object.assign(new MessageEmbed(), JSON.parse(JSON.stringify(embed)));
  }
};

peutil.EMOJIS = EMOJIS;

module.exports = peutil;