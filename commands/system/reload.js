const Command = require("../../structures/Command.js");

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
    if (!piece) return message.channel.send(this.client.responses.reloadNotFound.random().replaceAll("{{user}}", message.member.displayName));
    try {
      const reloadedPiece = await piece.reload();
      return message.channel.send(this.client.responses.reloadSuccess.random().replaceAll("{{command}}", reloadedPiece.name));
    } catch (error) {
      piece.store.set(piece);
      return message.channel.send(this.client.responses.reloadErrUnload.random().replaceAll("{{user}}", message.member.displayName).replaceAll("{{response}}", error.message || error.toString()));
    }
  }

  resolvePiece(arg) {
    const isCommand = this.client.commands.get(arg);
    if (isCommand) return isCommand;
    const isEvent = this.client.events.get(arg);
    if (isEvent) return isEvent;
    return false;
  }
}

module.exports = Reload;
