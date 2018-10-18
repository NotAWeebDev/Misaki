const Owner = require("../../structures/Owner.js");
const { inspect } = require("util");
const { post } = require("snekfetch");

class Eval extends Owner {
  constructor(...args) {
    super(...args, {
      name: "eval",
      description: "Evaluates arbitrary Javascript.",
      category: "Creator",
      usage: "eval <expression>",
      aliases: ["ev"],
      permLevel: "Creator"
    });
  }

  async run(message, args, level) { // eslint-disable-line no-unused-vars
    const { clean, client } = this;
    const code = args.join(" ");
    const token = client.token.split("").join("[^]{0,2}");
    const rev = client.token.split("").reverse().join("[^]{0,2}");
    const filter = new RegExp(`${token}|${rev}`, "g");
    try {
      let output = eval(code);
      if (output instanceof Promise || (Boolean(output) && typeof output.then === "function" && typeof output.catch === "function")) output = await output;
      output = inspect(output, { depth: 0, maxArrayLength: null });
      output = output.replace(filter, "[TOKEN]");
      output = clean(output);
      if (output.length < 1950) {
        message.channel.send(`\`\`\`js\n${output}\n\`\`\``);
      } else {
        try {
          const { body } = await post("https://text.evie.codes/documents").send(output);
          return message.channel.send(`Output was to long so it was uploaded to hastebin https://text.evie.codes/${body.key}.js `);
        } catch (error) {
          return message.channel.send(`I tried to upload the output to hastebin but encountered this error ${error.name}:${error.message}`);
        }
      }
    } catch (error) {
      return message.channel.send(`The following error occured \`\`\`js\n${error.stack}\`\`\``);
    }
  }

  clean(text)  {
    return text
      .replace(/`/g, "`" + String.fromCharCode(8203))
      .replace(/@/g, "@" + String.fromCharCode(8203));
  }
}

module.exports = Eval;
