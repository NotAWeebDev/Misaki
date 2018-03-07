/*
  Also known as "Static Mode"
*/

const PaginationEmbed = require("./base/PaginationEmbed");
const { MessageEmbed } = require("discord.js");

/**
 * @extends {PaginationEmbed}
 */
class Embeds extends PaginationEmbed {

  /**
   * Options for the constructor.
   * @typedef {Object} PaginationEmbedsOptions
   * @property {string} [title=null] - The title of all embeds.
   * @property {string} [description=null] - The description of all embeds.
   * @property {string} [url=null] - The URL of all embeds.
   * @property {number} [color=null] - The color of all embeds.
   * @property {boolean} [timestamp=null] - Whether to show timestamp to all embeds or not.
   * @property {Object[]} [fields=null] - The fields of all embeds.
   * @property {string} [thumbnail=null] - The thumbnail of all embeds.
   * @property {Object} [image=null] - The image of all embeds.
   * @property {Object} [author=null] - The author of all embeds.
   * @property {Object} [footer=null] - The footer of all embeds.
   */

  /**
   * @param {PaginationEmbedsOptions} [options={}] Options for Embeds.
   */
  constructor(options = {}) {
    if (!(options instanceof Object)) throw new Error("Cannot invoke Embeds class without an actual options object.");

    super(options);
    this.options = options;

    /**
     * The title of all embeds.
     * @type {string}
     */
    this.title = options.title || null;

    /**
     * The description of all embeds.
     * @type {string}
     */
    this.description = options.description || null;

    /**
     * The URL of all embeds.
     * @type {string}
     */
    this.url = options.url || null;

    /**
     * The color of all embeds.
     * @type {number}
     */
    this.color = options.color || null;

    /**
     * Whether to show timestamp to all embeds or not.
     * @type {boolean}
     */
    this.timestamp = options.timestamp || null;

    /**
     * The fields of all embeds.
     * @type {Object[]}
     */
    this.fields = options.fields || [];

    /**
     * The thumbnail of all embeds.
     */
    this.thumbnail = options.thumbnail || null;

    /**
     * The image of all embeds.
     * @type {Object}
     */
    this.image = options.image || null;

    /**
     * The author of all embeds.
     * @type {Object}
     */
    this.author = options.author || null;

    /**
     * The footer of all embeds.
     * @type {Object}
     */
    this.footer = options.footer || null;
  }

  /**
   * Embed in the current page.
   * @returns {MessageEmbed} - An instance of MessageEmbed.
   */
  get currentEmbed() {
    return this.array[this.page - 1];
  }

  /**
   * Adds a blank field to the fields of all embeds.
   * @param {boolean} [inline=false] - Whether the field is inline or not to the other fields.
   * @returns {Embeds} - Instance of Embeds
   */
  addBlankField(inline = false) {
    const arr = this.array;

    for (let i = 0; i < arr.length; i++)
      arr[i].addBlankField(inline);

    return this;
  }

  /**
   * Adds a field to the fields of all embeds.
   * @param {string} name - The name of the field.
   * @param {string} value - The value of the field.
   * @param {boolean} [inline=false] - Whether the field is inline or not to the other fields.
   * @returns {Embeds} - Instance of Embeds
   */
  addField(name, value, inline = false) {
    if (!name && !value) return this;

    const arr = this.array;

    for (let i = 0; i < arr.length; i++)
      arr[i].addField(name, value, inline);

    return this;
  }

  /**
   * Build the Pagination Embeds.
   *
   * @example
   *
   * // Object as constructor.
   * const Embeds = require("<utils>/pagination/Embeds");
   * const { MessageEmbed } = require("discord.js");
   *
   * // Under message event.
   * new Embeds({
   *  authorisedUser: message.author,
   *  channel: message.channel,
   *  clientMessage: { content: "Preparing the embed..." },
   *  array: [
   *    new MessageEmbed({ title: "John Doe" }),
   *    new MessageEmbed({ title: "Jane Doe" })
   *  ],
   *  pageIndicator: false,
   *  page: 2,
   *  timeout: 69000,
   *  emojis: {
   *    back: "◀",
   *    jump: "↗",
   *    forward: "▶",
   *    delete: "🗑"
   *  },
   *  description: "This is one of my embeds with this message!",
   *  color: 0xFF00AE,
   *  timestamp: true
   * }).build();
   *
   * @example
   *
   * // Methods as constructor.
   * const Embeds = require("<utils>/pagination/Embeds");
   * const { MessageEmbed } = require("discord.js");
   *
   * // Under message event.
   * new Embeds()
   *  .setAuthorisedUser(message.author)
   *  .setChannel(message.channel)
   *  .setClientMessage(null, "Preparing the embed...")
   *  .setArray([
   *    new MessageEmbed({ title: "John Doe" }),
   *    new MessageEmbed({ title: "Jane Doe" })
   *  ])
   *  .setPageIndicator(false)
   *  .setPage(2)
   *  .setTimeout(69000)
   *  .setEmojis({
   *    back: "◀",
   *    jump: "↗",
   *    forward: "▶",
   *    delete: "🗑"
   *  })
   *  .setDescription("This is one of my embeds with this message!")
   *  .setColor(0xFF00AE)
   *  .setTimestamp()
   *  .build();
   */
  async build() {
    this.pages = this.array.length;

    await this._verify(this.pages);

    this
      .setTitle(this.title)
      .setDescription(this.description)
      .setURL(this.url)
      .setColor(this.color)
      .setThumbnail(this.thumbnail)
      .setImage(this.image)
      .setAuthor(this.author)
      .setFooter(this.footer);

    if (this.fields.length) {
      const fields = this.fields;
      this.fields = [];

      for (let i = 0; i < fields.length; i++) {
        const field = fields[i];

        this.addField(field.name, field.value, field.inline);
      }
    }

    if (this.options.timestamp !== null && this.options.timestamp)
      this.setTimestamp();

    await this._loadList();
  }

  /**
   * Sets the array of embeds to paginate.
   * @param {Array} array - An array of embeds to paginate.
   * @returns {Embeds} - Instance of Embeds
   */
  setArray(array) {
    const isValidArray = Array.isArray(array) && Boolean(array.length);

    if (!isValidArray) throw new Error("Cannot invoke Embeds class without initialising the array to paginate.");

    for (let i = 0; i < array.length; i++)
      if (array[i] instanceof MessageEmbed) continue;
      else throw new Error(`(MessageEmbeds[${i}]) Cannot invoke Embeds class with an invalid MessageEmbed instance.`);

    this.array = array;

    return this;
  }

  /**
   * Set the author of all embeds.
   * @param {StringResolvable} name - The name of the author.
   * @param {string} [iconURL=null] - The icon URL of the author.
   * @param {string} [url=null] - The URL of the author.
   * @returns {Embeds} - Instance of Embeds
   */
  setAuthor(name, iconURL = null, url = null) {
    if (!name) return this;

    const arr = this.array;

    for (let i = 0; i < arr.length; i++)
      arr[i].setAuthor(name, iconURL, url);

    return this;
  }

  /**
   * Sets the color of all embeds.
   * @param {ColorResolvable} color - The color of all embeds.
   * @returns {Embeds} - Instance of Embeds
   */
  setColor(color) {
    if (!color) return this;

    const arr = this.array;

    for (let i = 0; i < arr.length; i++)
      arr[i].setColor(color);

    return this;
  }

  /**
   * Sets the description of all embeds.
   * @param {string} description - The description of all embeds.
   * @returns {Embeds} - Instance of Embeds
   */
  setDescription(description) {
    if (!description) return this;

    const arr = this.array;

    for (let i = 0; i < arr.length; i++)
      arr[i].setDescription(description);

    return this;
  }

  /**
   * Sets the footer of all embeds.
   * @param {string} text - The footer text.
   * @param {string} [iconURL=null] - URL for the footer"s icon.
   * @returns {Embeds} - Instance of Embeds
   */
  setFooter(text, iconURL = null) {
    if (!text) return this;

    const arr = this.array;

    for (let i = 0; i < arr.length; i++)
      arr[i].setFooter(text, iconURL);

    return this;
  }

  /**
   * Sets the image of all embeds.
   * @param {string} image - The image of all embeds.
   * @returns {Embeds} - Instance of Embeds
   */
  setImage(image) {
    if (!image) return this;

    const arr = this.array;

    for (let i = 0; i < arr.length; i++)
      arr[i].setImage(image);

    return this;
  }

  /**
   * Sets the thumbnail of all embeds.
   * @param {string} thumbnail - The thumbnail of all embeds.
   * @returns {Embeds} - Instance of Embeds
   */
  setThumbnail(thumbnail) {
    if (!thumbnail) return this;

    const arr = this.array;

    for (let i = 0; i < arr.length; i++)
      arr[i].setThumbnail(thumbnail);

    return this;
  }

  /**
   * Sets the timestamp of all embeds.
   * @returns {Embeds} - Instance of Embeds
   */
  setTimestamp() {
    const arr = this.array;

    for (let i = 0; i < arr.length; i++)
      arr[i].timestamp = new Date().getTime();

    return this;
  }

  /**
   * Sets the title of all embeds.
   * @param {string} title - The title of all embeds.
   * @returns {Embeds} - Instance of Embeds
   */
  setTitle(title) {
    if (!title) return this;

    const arr = this.array;

    for (let i = 0; i < arr.length; i++)
      arr[i].setTitle(title);

    return this;
  }

  /**
   * Sets the URL of all embeds.
   * @param {string} url - The URL of all embeds.
   * @returns {Embeds} - Instance of Embeds
   */
  setURL(url) {
    if (!url) return this;

    const arr = this.array;

    for (let i = 0; i < arr.length; i++)
      arr[i].setURL(url);

    return this;
  }

  async _loadList(callNavigation = true) {
    const shouldIndicate = this.showPageIndicator
      ? this.pages === 1
        ? null
        : `Page ${this.page} of ${this.pages}`
      : null;

    await this.clientMessage.message.edit(shouldIndicate, { embed: this.currentEmbed });

    super._loadList(callNavigation);
  }
}

module.exports = Embeds;
