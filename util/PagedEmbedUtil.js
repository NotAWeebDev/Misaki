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
class PagedEmbedUtil {
  /**
   * @typedef {object} PagedEmbedUtilOptions
   * @property {User} [caller] - The user who instantiated the command.
   * @property {Message} [message] - The message to edit with the paged embed. If there is no message,
   * it will send a message instead.
   * @property {TextChannel} [channel=PagedEmbedUtil#message] - The channel to post to. This value or PagedEmbedUtil#message must be filled in,
   * otherwise this command will fail.
   * @property {ReactionCollectorOptions} [collectorOptions={}] - Options to pass to the reaction collector, if any.
   */

  /**
   * @param {PagedEmbedUtilOptions} options
   */
  constructor(options = {}) {

    /**
     * Array of all pages, in the order they will appear in.
    * @type {MessageEmbed[]} 
     */
    this.pages = [];
    /**
     * The 0-indexed current page of the embed
     * @type {Number} 
     */
    this.currentPage = 0;

    /**
     * The map controlling the function of the embed. Maps reacted emoji to callback to execute.
     * @type {Map<Emoji,Function>}
     */
    this.responseMap = new Map(); //map, mapping emoji to action or function to be called, for example it might map ▶ to nextPage

    /**
     * An array of emojis in the order they should appear on the message.
     * @type {Emoji[]}
     */
    this.reactions = []; //array with emojis in order of how they should appear on the message

    /**
     * The message the paged embed is running on, if any.
     * @type {Message|null}
     */
    this.message = options.message || null; 

    /**
     * The channel the paged embed will appear in (or is currently in).
     * @type {TextChannel}
     */
    this.channel = options.channel || null;

    /**
     * The member who instantiated the command.
     * @type {GuildMember}
     */
    const caller = options.caller;
    if (caller instanceof GuildMember) this.caller = caller;
    if (caller instanceof User) this.caller = this.channel.guild.member(caller);
    if (typeof caller === "string") this.caller = this.channel.guild.members.get(caller);
    if (!caller) throw new TypeError("Option \"caller\" must be the member or user who instantiated the command");

    /**
     * The reaction collector being used, if there is one.
     * @type {ReactionCollector}
     */
    this.collector = null;

    /**
     * Options to be passed to the reaction collector.
     * @type {ReactionCollectorOptions}
     */
    this.collectorOptions = options.collectorOptions || {}; 
  }

  /**
   * Adds a single page to the paged embed.
   * @see PagedEmbedUtil.splitFields
   * @param {MessageEmbed} embed - The embed to add.
   * @returns {PagedEmbedUtil}
   */
  addPage(embed) {
    this.pages.push(embed);
    return this;
  }

  /**
   * Adds multiple pages to the paged embed
   * @see PagedEmbedUtil.splitFields
   * @param {MessageEmbed[]} embeds - The embeds to add.
   * @returns {PagedEmbedUtil}
   */
  addPages(embeds) {
    this.pages = this.pages.concat(embeds);
    return this;
  }

  /**
   * Set the pages of the paged embed to the array of embeds passed.
   * @see PagedEmbedUtil.splitFields
   * @param {MessageEmbed[]} embeds - The embeds to set the paged embed to use.
   * @returns {PagedEmbedUtil}
   */
  setPages(embeds) {
    this.pages = embeds;
    return this;
  }

  /**
   * Clears all the stored pages for the embed.
   * @see PagedEmbedUtil#addPage
   * @see PagedEmbedUtil#addPages
   * @returns {PagedEmbedUtil}
   */
  clearPages() {
    this.pages = [];
    return this;
  }

  /**
   * Adds a reaction to the embed, and associates it with a callback. This is then 
   * stored in {@link PagedEmbedUtil#reactionMap} and {@link PagedEmbedUtil#reactions}.
   * @param {Emoji} emoji - The emoji to react with, and associate with the callback
   * It may be useful to use {@link PagedEmbedUtil.EMOJIS} for this.
   * @param {Function|String} action - The callback to execute. If it is a string, it
   * will be replaced with the corresponding function.
   * * "nextPage", "next" will be replaced by {@link PagedEmbedUtil#nextPage}.
   * * "prevPage", "prev" will be replaced by {@link PagedEmbedUtil#prevPage}.
   * * "prompt", "goto", "gotoPage", "ask" will be replaced by {@link PagedEmbedUtil#prompt}
   * Otherwise, the methods {@link PagedEmbedUtil#nextPage}, {@link PagedEmbedUtil#prevPage},
   * {@link PagedEmbedUtil#prompt} and {@link PagedEmbedUtil#pageTo} should be used.
   * @see PagedEmbedUtil#nextPage
   * @see PagedEmbedUtil#prevPage
   * @see PagedEmbedUtil#prompt
   * @see PagedEmbedUtil#pageTo
   * @see PagedEmbedUtil.EMOJIS
   * @returns {PagedEmbedUtil}
   */
  useReaction(emoji, action) {
    const position = this.reactions.indexOf(emoji);
    if (position !== -1) this.reactions.splice(position, 1);
    this.reactions.push(emoji);
    if (typeof action === "string") {
      if (["nextpage", "next"].indexOf(action) !== -1) action = this.nextPage.bind(this);
      if (["prevpage", "prev"].indexOf(action) !== -1) action = this.prevPage.bind(this);
      if (["prompt", "goto", "gotoPage", "ask"].indexOf(action) !== -1) action = this.createPrompt.bind(this);
    }
    this.responseMap.set(emoji, action);
    return this;
  }

  /**
   * Clears all the reactions stored. This will not delete any reactions from the message.
   * @see PagedEmbedUtil#reapplyReactions
   * @returns {PagedEmbedUtil}
   */
  clearReactions() {
    this.responseMap.clear();
    this.reactions = [];
    return this;
  }

  /**
   * Removes all reactions from a message, then re-adds them in the order defined in {@link PagedEmbedUtil#reactions}
   * @async
   * @returns {Promise<PagedEmbedUtil>}
   */
  async reapplyReactions() {
    const perms = this.channel.permissionsFor(this.channel.guild.me).has("MANAGE_REACTIONS");
    if (perms) this.message.reactions.removeAll();
    else this.message.reactions.map(r => r.users.remove());
    for (const emoji of this.reactions) {
      await this.message.react(emoji);
    }
    return this;
  }

  /**
   * Removes all reactions and stops the reaction collector.
   * @returns {PagedEmbedUtil}
   */
  end() {
    const perms = this.channel.permissionsFor(this.channel.guild.me).has("MANAGE_REACTIONS");
    if (perms) this.message.reactions.removeAll();
    else this.message.reactions.map(r => r.users.remove());
    this.collector.stop();
    return this;
  }

  /**
   * Changes the embed to the next page.
   * @see PagedEmbedUtil#useReaction
   * @param {Boolean} [overlap=true] - Whether the embed should go to the first page if it is currently 
   * on the last page. true for if it should overlap, false for if it should just do nothing.
   * @returns {PagedEmbedUtil}
   */
  nextPage(overlap = true) {
    this.currentPage++;
    if (this.currentPage >= this.pages.length) this.currentPage = overlap ?  0: this.pages.length - 1;
    return this._update();
  }

  /**
   * Changes the embed to the previous page.
   * @see PagedEmbedUtil#useReaction
   * @param {Boolean} [overlap=true] - Whether the embed should go to the last page if it is currently 
   * on the first page. true for if it should overlap, false for if it should just do nothing.
   * @returns {PagedEmbedUtil}
   */
  prevPage(overlap = true) {
    this.currentPage--;
    if (this.currentPage < 0) this.currentPage = overlap ? this.pages.length - 1 : 0;
    return this._update();
  }

  /**
   * Changes the page of the embed to a specified page.
   * @param {Number|String} page - The 1-indexed page that the embed should be changed to.
   * @returns {PagedEmbedUtil}
   */
  pageTo(page) {
    if (typeof page === "string") page = Number(page);
    if (!Number.isInteger(page)) throw new TypeError("Argument must be an integer");
    page--; // users will assume its 1-indexed and not 0-indexed
    if (page < 0 || page >= this.pages.length) throw new RangeError("Out of page range");
    this.currentPage = page;
    return this._update();
  }

  /**
   * Prompts the user to go to a specific page.
   * @see PagedEmbedUtil#pageTo
   * @returns {PagedEmbedUtil}
   */
  prompt() {
    this.channel.client.awaitReply(this.message, "What page do you want to see? (Say `cancel` to cancel this prompt)", m => m.author.id === this.caller.user.id, undefined, null)
      .then(response => {
        if (response.toLowerCase().trim() === "cancel") return;
        const page = Number(response);
        if (isNaN(page)) return this.channel.send("That is not a valid response.");
        return this.pageTo(page).catch(() => this.channel.send("That page does not exist."));
      });
    return this;
  }

  /**
   * Runs the embed. A message will be sent if none was provided, a
   * reaction collector will be created, and the message will have reactions applied to it.
   * @async
   * @returns {Promise<PagedEmbedUtil>}
   */
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
    return this;
  }

  /**
   * Updates the embed to be on the correct page.
   */
  _update() {
    const embed = this.pages[this.currentPage];
    if (!embed) return;
    embed.footer = {
      text: `${this.currentPage + 1}/${this.pages.length}` 
    };
    return this.message.edit({ embed });
  }

  /**
   * Splits a string into pages that conform to embed limits. If an embed is provided, 
   * it will return an array of embeds with identical properties, but different field values.
   * @param {String} string - The string to be split.
   * @param {String|RegExp} [splitRegex=/(\n|\.)/] - The regex to split by. Note that
   * if a string is provided, it will be converted to an embed with new RegExp(`(${splitRegex})`).
   * This is so that when .split() is called on the string, the split parts are kept in the array.
   * {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/split}
   * @param {Number} [perPage=10] - The number of split elements per page
   * @param {MessageEmbed} [embed] - The embed to copy the fields into.
   * @param {String} [fieldTitle="\u200b"] - The field title to use for the embeds.
   * 
   * @static
   * @returns {String[]|MessageEmbed[]}
   */
  static splitFields(string, splitRegex = /(\n|\.)/, perPage = 10, embed, fieldTitle = "\u200b") {
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
    return split.map(e => this.cloneEmbed(embed).addField(fieldTitle, e));

  }

  /**
   * Deep clones an embed.
   * @param {MessageEmbed} embed - The embed to deep clone.
   * @returns {MessageEmbed}
   */
  static cloneEmbed(embed) {
    return Object.assign(new MessageEmbed(), JSON.parse(JSON.stringify(embed)));
  }
}

/**
 * An object with lots of useful unicode emojis.
 * @constant
 * @see PagedEmbedUtil#useReaction
 * @type {Object}
 */
PagedEmbedUtil.EMOJIS = EMOJIS;

module.exports = PagedEmbedUtil;