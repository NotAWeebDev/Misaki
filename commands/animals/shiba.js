const Social = require(`${process.cwd()}/base/Social.js`);
const { get } = require("snekfetch");
class Shibe extends Social {
  constructor(client) {
    super(client, {
      name: "shiba",
      description: "Post a randomly selected image of a Shiba Inu.",
      category: "Animals",
      usage: "shiba",
      extended: "This command will return a beautiful Shiba Inu.",
      cost: 5,
      cooldown: 10,
      aliases: ["doge", "shib", "shibe"]
    });
  }

  async run(message, args, level) { // eslint-disable-line no-unused-vars
    const msg = await message.channel.send(`<a:typing:397490442469376001> **${message.member.displayName}** is petting a shiba inu...`);
    
    if (message.settings.socialSystem === "true") {
      await this.cmdPay(message, message.author.id, this.help.cost, { msg });
    }
    const { body } = await get("http://shibe.online/api/shibes");
    await msg.edit({embed:{ "title": "Click here if the image failed to load.", "url": body[0], "color":message.guild.me.roles.highest.color || 5198940, "image": {"url": body[0]}}});
  }
}

module.exports = Shibe;