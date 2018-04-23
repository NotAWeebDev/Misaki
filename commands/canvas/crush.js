const Social = require("../../structures/Social.js");
const { MessageAttachment } = require("discord.js");

class Crush extends Social {
  constructor(...args) {
    super(...args, {
      name: "crush",
      description: "Display your affection for another user.",
      category: "Canvas",
      usage: "crush [@mention|userid]",
      cost: 10,
      cooldown: 10,
      loadingString: "<a:typing:397490442469376001> **{{displayName}}** gaze around...",
      botPerms: ["ATTACH_FILES"]
    });
  }

  cmdVerify(message, args, loadingMessage) {
    return this.verifyUser(message, message.mentions.users.size === 1 ? message.mentions.users.first().id : message.author.id, { msg: loadingMessage });
  }

  async run(message, args, level, loadingMessage) {
    const crush = await this.cmdVerify(message, args, loadingMessage);
    const crusher = message.author;

    await message.channel.send(new MessageAttachment(await this.client.idiotAPI.crush(crush.displayAvatarURL({format:"png", size:512}), crusher.displayAvatarURL({format:"png", size:128})), "crush.png"));
    await loadingMessage.delete();
  }
}

module.exports = Crush;//