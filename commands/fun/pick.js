const Social = require(`${process.cwd()}/base/Social.js`);

class Pick extends Social {
  constructor(client) {
    super(client, {
      name: "pick",
      description: "Pick out of a list",
      category: "Fun",
      usage: "pick <option1>, <option2>, <option3>, <etc>",
      extended: "This command will help you select out of a list of supplied options.",
      cost: 5,
      aliases: ["choose"],
      
    });
  }

  async run(message, args, level) { // eslint-disable-line no-unused-vars
    const options = args.join(" ");
    if (options.length < 2) return message.response(undefined, "Invalid command usage, you must supply text.");
    const list = options.split(",");
    if (list.length < 2 || list[1] === "") return message.response(undefined, "Invalid command usage, you must supply at least two items to pick from.");
    if (message.settings.socialSystem === "true") {
      if (!(await this.cmdPay(message, message.author.id, this.help.cost))) return;
    }
    try {
      const msg = await message.channel.send(`<a:typing:397490442469376001> **${message.guild.me.displayName}** is thinking...`);
      setTimeout(
        () => msg.edit(`I think \`${list[Math.floor(Math.random()*list.length)].trim()}\``),
        Math.random() * (1 - 5) + 1 * 5000
      );
    } catch (error) {
      this.client.logger.error(error);
    }
  }
}

module.exports = Pick;