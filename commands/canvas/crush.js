const Social = require(`${process.cwd()}/base/Social.js`);
const { MessageAttachment } = require("discord.js");

class Crush extends Social {
  constructor(client) {
    super(client, {
      name: "crush",
      description: "Display your affection for another user.",
      category: "Canvas",
      usage: "crush [@mention|userid]",
      cost: 10,
      cooldown: 10
    });
  }

  async run(message, args, level) { // eslint-disable-line no-unused-vars
    const msg = await message.channel.send(`<a:typing:397490442469376001> **${crush.username}** is being gazed at...`);
    const crush = await this.verifyUser(message, message.mentions.users.size === 1 ? message.mentions.users.first().id : message.author.id, { msg });
    const crusher = message.author;

    if (message.settings.socialSystem === "true") {
      await this.cmdPay(message, message.author.id, this.help.cost, { msg });
    }

    await message.channel.send(new MessageAttachment(await this.client.idiotAPI.crush(crusher.displayAvatarURL({format:"png", size:128}), crush.displayAvatarURL({format:"png", size:512})), "crush.png"));
    await msg.delete();
  }
}

module.exports = Crush;//