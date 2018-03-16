const Command = require("../../base/Command.js");

class Reload extends Command {
  constructor(...args) {
    super(...args, {
      name: "reload",
      description: "Reloads a command or event that has been modified.",
      category: "System",
      usage: "reload <command|event>",
      permLevel: "Bot Admin"
    });
  }

  async run(message, [piece]) {
    if (!piece || !piece.length) return message.channel.send(this.client.responses.reloadMissingArg.random().replaceAll("{{user}}", message.member.displayName));
    piece = this.resolvePiece(piece);
    if (!piece) return message.channel.send("Invalid piece");
    try {
      const reloadedPiece = await piece.reload();
      return message.channel.send(`Successfully reloaded ${reloadedPiece.store.name.slice(0, -1)}: ${reloadedPiece.name}`);
    } catch (error) {
      piece.store.set(piece);
      return message.channel.send(`Unsucessfully reloaded ${piece.store.name.slice(0, -1)}: ${error}`);
    }
  }

  resolvePiece(arg) {
    const isCommand = this.client.commands.get(arg);
    const isEvent = this.client.events.get(arg);
    if (isCommand) return isCommand;
    if (isEvent) return isEvent;
    return false;
  }
}

module.exports = Reload;
