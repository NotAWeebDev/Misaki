const { MessageEmbed } = require("discord.js");

/**
 * @extends {MessageEmbed}
 */
class PaginationEmbed extends MessageEmbed {

  /**
   * Options for PaginationEmbed.clientMessage.
   * @typedef {Object} ClientMessageOptions
   * @property {Message} [message=null] - The message object sent by the client, if there is any.
   * @property {string} [content="Preparing..."] - The custom message content while preparing the embed.
   */

  /**
   * Options for PaginationEmbed.emojis.
   * @typedef {Object} NavigationButtons
   * @property {string} [back="◀"] - The back button.
   * @property {string} [jump="↗"] - The jump button.
   * @property {string} [forward="▶"] - The forward button.
   * @property {string} [delete="🗑"] - The delete button.
   */

  /**
   * Options for the constructor.
   * @typedef {Object} PaginationEmbedOptions
   * @property {User} [authorisedUser=null] - The authorised user to navigate the pages.
   * @property {TextChannel} channel - The channel where to send the embed.
   * @property {ClientMessageOptions} [clientMessage=null] - Settings for the message sent by the client.
   * @property {*[]} array - An array of elements to paginate.
   * @property {boolean} [pageIndicator=true] - Whether page number indicator on client"s message is shown or not.
   * @property {nmber|string} [page=1] - Jumps to a certain page upon PaginationEmbeds.build().
   * @property {number} [timeout=30000] - The time for awaiting a user action before timeout in ms.
   * @property {NavigationButtons} [emojis={back:"◀",jump:"↗",forward:"▶",delete:"🗑"}] - The emojis used for navigation buttons.
   */

  /**
   * @param {PaginationEmbedOptions} [options={}] Options for PaginationEmbed.
   */
  constructor(options = {}) {
    if (!(options instanceof Object)) throw new Error("Cannot invoke PaginationEmbed class without an actual options object.");

    super(options);

    /**
     * The authorised user to navigate the pages.
     * @type {User}
     */
    this.authorisedUser = options.authorisedUser || null;

    /**
     * The channel where to send the embed.
     * @type {TextChannel}
     */
    this.channel = options.channel || null;

    /**
     * Settings for the message sent by the client.
     * @type {ClientMessageOptions}
     */
    this.clientMessage = options.clientMessage || { message: null, content: null };

    /**
     * An array of elements to paginate.
     * @type {*[]}
     */
    this.array = options.array || [];

    /**
     * Whether page number indicator on client"s message is shown or not.
     * @type {boolean}
     */
    this.pageIndicator = options.pageIndicator || true;

    /**
     * Jumps to a certain page upon PaginationEmbed.build().
     * @type {number|string}
     */
    this.page = options.page || 1;

    /**
     * The time for awaiting a user action before timeout in ms.
     * @type {number}
     */
    this.timeout = options.timeout || 30000;

    /**
     * The emojis used for navigation buttons.
     * @type {NavigationButtons}
     */
    this.emojis = options.emojis || {
      back: "◀",
      jump: "↗",
      forward: "▶",
      delete: "🗑"
    };

    /**
     * Number of pages for this instance.
     * @type {number}
     * @private
     * @protected
     */
    this.pages = null;
  }

  build() {
    throw new Error("Cannot invoke this class. Invoke with [pagination/Embeds] or [pagination/FieldsEmbed] instead.");
  }

  /**
   * Sets the array of elements to paginate.
   * @param {Array} array - An array of elements to paginate.
   * @returns {PaginationEmbed} - Instance of PaginationEmbed
   */
  setArray(array) {
    const isValidArray = Array.isArray(array) && Boolean(array.length);

    if (!isValidArray) throw new Error("Cannot invoke PaginationEmbed class without initialising the array to paginate.");

    this.array = array;

    return this;
  }

  /**
   * Set the authorised person to navigate the pages.
   * @param {User} [user=null] - The user object.
   * @returns {PaginationEmbed} - Instance of PaginationEmbed
   */
  setAuthorisedUser(user = null) {
    this.authorisedUser = user;

    return this;
  }

  /**
   * The channel where to send the embed.
   * @param {TextChannel} channel - The channel object.
   * @returns {PaginationEmbed} - Instance of PaginationEmbed
   */
  setChannel(channel) {
    this.channel = channel;

    return this;
  }

  /**
   * Sets the settings for the message sent by the client.
   * @param {Message} [message=null] - The message object sent by the client, if there is any.
   * @param {string} [content="Preparing..."] - The custom message content while preparing the embed.
   * @returns {PaginationEmbed} - Instance of PaginationEmbed
   */
  setClientMessage(message = null, content = null) {
    if (!content) content = "Preparing...";

    Object.assign(this.clientMessage, { message, content });

    return this;
  }

  /**
   * Sets the emojis used for navigation buttons.
   * @param {NavigationButtons} [emojis={}] - An object containing customised emojis to use as navigation buttons.
   * @returns {PaginationEmbed} - Instance of PaginationEmbed
   */
  setEmojis(emojis) {
    Object.assign(this.emojis, emojis);

    return this;
  }

  /**
   * Sets to jump to a certain page upon calling PaginationEmbed.build().
   * @param {number|string} [param=1] - The page number to jump to. As String: "back", "forward"
   * @returns {PaginationEmbed} - Instance of PaginationEmbed
   */
  setPage(param = 1) {
    const isString = typeof param === "string";

    if (!(!isNaN(param) || isString)) throw new Error("setPage() only accepts number/string type.");

    const navigator = param === "back"
      ? this.page === 1 ? this.page : this.page - 1
      : this.page === this.pages ? this.pages : this.page + 1;

    this.page = isString ? navigator : param;

    return this;
  }

  /**
   * Sets the time for awaiting a user action before timeout in ms.
   * @param {number} [timeout=30000] Timeout value in ms.
   * @returns {PaginationEmbed} - Instance of PaginationEmbed
   */
  setTimeout(timeout = 30000) {
    if (typeof timeout !== "number") throw new Error("setTimeout() only accepts number type.");

    this.timeout = timeout;

    return this;
  }

  /**
   * Sets whether page number indicator on client"s message is shown or not.
   * @param {boolean} [boolean=true] - Show page indicator?
   * @returns {PaginationEmbed} - Instance of PaginationEmbed
   */
  showPageIndicator(boolean = true) {
    if (typeof boolean !== "boolean") throw new Error("showPageIndicator() only accepts boolean type.");

    this.pageIndicator = boolean;

    return this;
  }

  /**
   * @private
   * @protected
   * Evaluates the constructor and the client.
   * @param {number} pages - The number of pages in this instance.
   */
  async _verify(pages) {
    this
      .setChannel(this.channel)
      .setAuthorisedUser(this.authorisedUser)
      .setClientMessage(this.clientMessage.message, this.clientMessage.content)
      .setArray(this.array)
      .showPageIndicator(this.pageIndicator)
      .setTimeout(this.timeout)
      .setEmojis(this.emojis);

    this.pages = pages;
    this.setPage(this.page);

    if (!(this.page >= 1 && this.page <= this.pages)) throw new Error("Invalid page.");

    const message = this.clientMessage.message
      ? await this.clientMessage.message.edit(this.clientMessage.content)
      : await this.channel.send(this.clientMessage.content);
    this.setClientMessage(message, this.clientMessage.content);

    const permissions = ["ADD_REACTIONS", "MANAGE_REACTIONS", "MANAGE_MESSAGES", "EMBED_LINKS"];
    const missing = message.channel.permissionsFor(message.client.user).missing(permissions);

    if (missing.length)
      throw new Error(`Cannot invoke PaginationEmbeds class without required permissions: ${missing.join(", ")}`);
  }

  /**
   * Deploys emoji reacts for the message sent by the client.
   * @private
   * @protected
   */
  async _drawNavigation() {
    if (this.page !== 1) await this.clientMessage.message.react(this.emojis.back);
    if (this.pages > 2) await this.clientMessage.message.react(this.emojis.jump);
    if (this.page !== this.pages) await this.clientMessage.message.react(this.emojis.forward);
    await this.clientMessage.message.react(this.emojis.delete);

    this._awaitResponse();
  }

  /**
   * Helper for intialising the MessageEmbed.
   * [For sub-class] Initialises the MessageEmbed.
   * @private
   * @protected
   * @param {boolean} [callNavigation=true] - Whether to call _drawNavigation() or not.
   */
  _loadList(callNavigation = true) {
    if (callNavigation) return this._drawNavigation();

    this.clientMessage.message.react(this.emojis.delete);
  }

  /**
   * Calls PaginationEmbed.setPage().
   * @private
   * @protected
   * @param {number} param - The page number to jump to. As String: "back", "forward"
   */
  async _loadPage(param = 1) {
    const oldPage = this.page;
    this.setPage(param);

    if (oldPage === 1 || oldPage === this.pages || this.page === 1 || this.page === this.pages) {
      await this.clientMessage.message.reactions.removeAll();

      this._loadList(true);
    } else {
      await this._loadList(false);

      this._awaitResponse();
    }
  }

  /**
   * Awaits the reaction from the user.
   * @private
   * @protected
   */
  async _awaitResponse() {
    const emojis = Object.values(this.emojis);
    const filter = (r, u) => {
      if (this.authorisedUser)
        return u.id === this.authorisedUser.id && emojis.includes(r.emoji.name);

      return !u.bot && emojis.includes(r.emoji.name);
    };
    const clientMessage = this.clientMessage.message;

    try {
      const responses = await clientMessage.awaitReactions(filter, { max: 1, time: this.timeout, errors: ["time"] });
      const response = responses.first();
      const user = response.users.last();
      const emoji = response.emoji.name;

      if (emoji === this.emojis.delete) return clientMessage.delete();

      await response.users.remove(user);

      switch (emoji) {
        case this.emojis.back:
          if (this.page === 1) return this._awaitResponse();

          this._loadPage("back");
          break;

        case this.emojis.jump:
          if (this.pages <= 2) return this._awaitResponse();

          this._awaitResponseEx(user);
          break;

        case this.emojis.forward:
          if (this.page === this.pages) return this._awaitResponse();

          this._loadPage("forward");
          break;
      }
    } catch (c) {
      await clientMessage.reactions.removeAll();

      if (c instanceof Error) throw c;
    }
  }

  /**
   * Awaits the custom page input from the user.
   * @private
   * @protected
   * @param {User} user - The user who reacted to jump on a certain page.
   */
  async _awaitResponseEx(user) {
    const cancel = ["0", "cancel"];
    const filter = m => {
      const supposedPage = Number(m.content);

      return (
        m.author.id === user.id && (
          (!isNaN(m.content) && supposedPage !== this.page && supposedPage >= 1 && supposedPage <= this.pages) ||
          cancel.includes(m.content.toLowerCase())
        )
      );
    };
    const channel = this.clientMessage.message.channel;
    const prompt = await channel.send("To what page would you like to jump? Say `cancel` or `0` to cancel the prompt.");

    try {
      const responses = await channel.awaitMessages(filter, { max: 1, time: this.timeout, errors: ["time"] });
      const response = responses.first();
      const content = response.content;

      await prompt.delete();
      await response.delete();

      if (cancel.includes(content)) return this._awaitResponse();

      this._loadPage(Number(content));
    } catch (c) {
      await prompt.delete();

      if (c instanceof Error) throw c;
    }
  }
}

module.exports = PaginationEmbed;
