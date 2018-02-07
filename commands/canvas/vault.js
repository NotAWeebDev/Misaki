const Social = require(`${process.cwd()}/base/Social.js`);
const { MessageAttachment } = require("discord.js");

class Valut extends Social {
  constructor(client) {
    super(client, {
      name: "thumbs",
      description: "Give a thumbs up as another user.",
      category: "Canvas",
      usage: "thumbs [@mention|user id]",
      extended: "Mention another user to thumbs up of them.",
      cost: 10,
      cooldown: 10,
      aliases: ["vault"]
    });
  }

  async run(message, args, level) { // eslint-disable-line no-unused-vars
    const msg = await message.channel.send(`<a:typing:397490442469376001> **${message.member.displayName}** is wandering the wastelands...`);
    const vaultDweller = await this.verifyUser(message, message.mentions.users.size === 1 ? message.mentions.users.first().id : message.author.id);
    await message.channel.send(new MessageAttachment(await this.client.idiotAPI.vaultBoy(vaultDweller.displayAvatarURL({ format:"png", size:512 })), "vaultboy.png"));
    await msg.delete();
  }
}

module.exports = Valut;
