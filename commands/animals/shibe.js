const Social = require(`${process.cwd()}/base/Social.js`);
const snek = require("snekfetch");
class Shibe extends Social {
  constructor(client) {
    super(client, {
      name: "shibe",
      description: "Post a randomly selected image of a Shiba Inu.",
      category: "Animals",
      usage: "shibe",
      extended: "This command will return a beautiful Shiba Inu.",
      cost: 5,
      cooldown: 10,
      aliases: ["doge", "shib"]
    });
  }

  async run(message, args, level) { // eslint-disable-line no-unused-vars
    try {

      if (message.settings.socialSystem === "true") {
        if (!(await this.cmdPay(message, message.author.id, this.help.cost))) return;
      }

      const msg = await message.channel.send(`<a:typing:397490442469376001> **${message.member.displayName}** is petting a shibe...`);
      const { body } = await snek.get("http://shibe.online/api/shibes");
      await msg.edit({embed:{ "title": "Click here if the image failed to load.", "url": body[0], "color":message.guild.member(this.client.user.id).highestRole.color || 5198940, "image": {"url": body[0]}}});
    } catch (e) {
      console.log(e);
    }
  }
}

module.exports = Shibe;