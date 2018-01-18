const Owner = require(`${process.cwd()}/base/Owner.js`);

class Eval extends Owner {
  constructor(client) {
    super(client, {
      name: "eval",
      description: "Evaluates arbitrary Javascript.",
      category: "Owner",
      usage: "eval <expression>",
      aliases: ["ev"],
      permLevel: "Bot Owner"
    });
  }

  async run(message, args, level) { // eslint-disable-line no-unused-vars
    const code = args.join(" ");
    try {
      const asyncCode = `(async() => ${code} )()`;
      const evaled = await eval(asyncCode);
      const clean = await this.client.clean(this.client, evaled);
      message.channel.send(`\`\`\`js\n${clean}\n\`\`\``);
    } catch (err) {
      message.channel.send(`\`ERROR\` \`\`\`xl\n${await this.client.clean(this.client, err)}\n\`\`\``);
    }
  }
}

module.exports = Eval;
