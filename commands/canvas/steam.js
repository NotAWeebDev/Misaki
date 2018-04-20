const Social = require("../../structures/Social.js");
const { MessageAttachment } = require("discord.js");

class Steam extends Social {
  constructor(...args) {
    super(...args, {
      name: "steam",
      description: "Create a steam trading card.",
      category: "Canvas",
      usage: "steam [@mention]",
      cost: 10,
      cooldown: 10,
      aliases:["card"],
      loadingString: "<a:typing:397490442469376001> **{{displayName}}** unlocked a trading card...",
      botPerms: ["ATTACH_FILES"]
    });
  }

  cmdVerify(message, args, loadingMessage) {
    return this.verifyUser(message, message.mentions.users.size === 1 ? message.mentions.users.first().id : message.author.id, { msg: loadingMessage });
  }

  async run(message, args, level, loadingMessage) {
    const steamCard = await this.cmdVerify(message, args, loadingMessage);
    await message.channel.send(new MessageAttachment(await this.client.idiotAPI.steam(steamCard.displayAvatarURL({ format: "png", size: 512 }), (message.mentions.members.first() || message.member).displayName), "steam-card.png"));
    await loadingMessage.delete();
  }
}

module.exports = Steam;
