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
    const crush = await this.verifyUser(message, args[0] ? args[0] : message.author.id);
    const crusher = message.author;
    if (message.settings.socialSystem === "true") {
      if (!(await this.cmdPay(message, message.author.id, this.help.cost))) return;
    }
    const msg = await message.channel.send(`<a:typing:397490442469376001> **${crush.username}** is being gazed at...`);

    await message.channel.send(new MessageAttachment(await this.client.idiotAPI.crush(crusher.displayAvatarURL({format:"png", size:128}), crush.displayAvatarURL({format:"png", size:512})), "crush.png"));
    await msg.delete();
  }
}

module.exports = Crush;//