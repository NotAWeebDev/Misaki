/*
  Also known as "Leaderboard-Embed/Dynamic Mode"
*/

const PaginationEmbed = require("./base/PaginationEmbed");
const { MessageEmbed } = require("discord.js");

/**
 * @extends {PaginationEmbed}
 */
class FieldsEmbed extends PaginationEmbed {

  /**
   * Options for FieldsEmbed.fields.
   * @typedef {Object[]} FieldOptions
   * @property {string} name - Name of the field.
   * @property {Function} value - Value of the field. Function for Array.prototype.map().join("\n").
   * @property {boolean} [inline=true] - Whether the field is inline with other field or not.
   */

  /**
   * Options for the constructor.
   * @typedef {Object} FieldsEmbedOptions
   * @property {number} [elementsPerPage=10] - Items per page.
   * @property {FieldOptions} fields - An array formatted fields to input.
   */

  /**
   * @param {FieldsEmbedOptions} [options={}] Options for pagination utility.
   */
  constructor(options = {}) {
    if (!(options instanceof Object)) throw new Error("Cannot invoke FieldsEmbed class without an actual options object.");

    super(options);

    /**
     * Maximum number of elements to be displayed per page.
     * @type {number}
     */
    this.elementsPerPage = options.elementsPerPage || 10;
  }

  /**
   * Elements in the current page.
   * @returns {*[]} - An array for a page.
   */
  get elementList() {
    const begin = (this.page - 1) * this.elementsPerPage;
    const end = begin + this.elementsPerPage;

    return this.array.slice(begin, end);
  }

  /**
   * Build the Pagination Fields Embed.
   *
   * @example
   *
   * // Object as constructor.
   * const FieldsEmbed = require("<utils>/pagination/FieldsEmbed");
   *
   * // Under message event.
   * new FieldsEmbed({
   *  authorisedUser: message.author,
   *  channel: message.channel,
   *  clientMessage: { content: "Preparing the embed..." },
   *  array: [
   *    { id: 1, name: "John Doe" },
   *    { id: 2, name: "Jane Doe" }
   *  ],
   *  elementsPerPage: 1,
   *  pageIndicator: false,
   *  fields: [
   *    { name: "ID", value: el => el.id },
   *    { name: "Name", value: el => el.name }
   *  ],
   *  page: 2,
   *  timeout: 69000,
   *  emojis: {
   *    back: "◀",
   *    jump: "↗",
   *    forward: "▶",
   *    delete: "🗑"
   *  }
   * }).build();
   *
   * @example
   *
   * // Methods as constructor.
   * const FieldsEmbed = require("<utils>/pagination/FieldsEmbed");
   *
   * // Under message event.
   * new FieldsEmbed()
   *  .setAuthorisedUser(message.author)
   *  .setChannel(message.channel)
   *  .setClientMessage(null, "Preparing the embed...")
   *  .setArray([
   *    { id: 1, name: "John Doe" },
   *    { id: 2, name: "Jane Doe" }
   *  ])
   *  .setElementsPerPage(1)
   *  .setPageIndicator(false)
   *  .formatField("ID", el => el.id)
   *  .formatField("Name", el => el.name)
   *  .setPage(2)
   *  .setTimeout(69000)
   *  .setEmojis({
   *    back: "◀",
   *    jump: "↗",
   *    forward: "▶",
   *    delete: "🗑"
   *  })
   *  .build();
   */
  async build() {
    this.pages = Math.ceil(this.array.length / this.elementsPerPage);
    this
      .setElementsPerPage(this.elementsPerPage)
      .setPage(this.page);

    await this._verify(this.pages);

    const isValidFields = Array.isArray(this.fields) && Boolean(this.fields.length);

    if (!isValidFields) throw new Error("Cannot invoke FieldsEmbed class without initialising at least one field.");

    const fields = this.fields;
    this.fields = [];

    for (let i = 0; i < fields.length; i++) {
      const field = fields[i];

      this.formatField(field.name, field.value, field.inline);
    }

    const hasPaginateField = this.fields.filter(f => typeof f.value === "function");

    if (!hasPaginateField) throw new Error("Cannot invoke FieldsEmbed class without at least one field to paginate.");

    await this._loadList();
  }

  /**
   * Adds a field to the embed.
   * Same as MessageEmbed.addField, but value takes a function instead.
   * @param {string} name - Name of the field.
   * @param {Function} value - Value of the field. Function for Array.prototype.map().join("\n").
   * @param {boolean} [inline=true] - Whether the field is inline with other field or not.
   * @returns {FieldsEmbed} - Instance of FieldsEmbed
   */
  formatField(name, value, inline = true) {
    this.fields.push({ name, value, inline });

    return this;
  }

  /**
   * Sets the maximum number of elements to be displayed per page.
   * @param {number} [number=10] - Maximum number of elements to be displayed per page.
   * @returns {FieldsEmbed} - Instance of FieldsEmbed
   */
  setElementsPerPage(number = 10) {
    if (typeof number !== "number") throw new Error("setElementsPerPage() only accepts number type.");

    this.elementsPerPage = number;

    return this;
  }

  _drawList() {
    const embed = new MessageEmbed({
      type: this.type,
      title: this.title,
      description: this.description,
      url: this.url,
      color: this.color,
      timestamp: this.timestamp,
      thumbnail: this.thumbnail,
      image: this.image,
      video: this.video,
      author: this.author,
      provider: this.provider,
      footer: this.footer,
      files: this.files
    });

    if (this.pageIndicator && this.pages > 1)
      embed.setDescription(
        this.description
          ? `${this.description}\n\nPage ${this.page} of ${this.pages}`
          : `Page ${this.page} of ${this.pages}`
      );

    for (let i = 0; i < this.fields.length; i++) {
      const field = this.fields[i];

      embed.addField(
        field.name,
        typeof field.value === "function"
          ? this.elementList.map(field.value).join("\n")
          : field.value,
        field.inline
      );
    }

    return embed;
  }

  async _loadList(callNavigation = true) {
    const embed = this._drawList();
    await this.clientMessage.message.edit({ embed });

    super._loadList(callNavigation);
  }
}

module.exports = FieldsEmbed;
