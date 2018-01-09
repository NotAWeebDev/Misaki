const Command = require(`${process.cwd()}/base/Command.js`);
const exec = require("child_process").exec;

class Exec extends Command {
  constructor(client) {
    super(client, {
      name: "exec",
      description: "Executes a new process, very dangerous.",
      usage: "exec <expression>",
      aliases: ["shell"],
      category: "System",
      extended: "This will spawn a child process and execute the given command.",
      botPerms: ["SEND_MESSAGES"],
      permLevel: "Bot Owner"
    });
  }

  async run(message, args, level) { // eslint-disable-line no-unused-vars
    exec(`${args.join(" ")}`, (error, stdout) => {
      const response = (error || stdout);
      message.channel.send(`Ran: ${message.content}\n\`\`\`${response}\`\`\``, {split: true}).catch(console.error);
    });
  }
}

module.exports = Exec;
