const Social = require(`${process.cwd()}/base/Social.js`);
const snekfetch = require("snekfetch");
class Bunny extends Social {
  constructor(client) {
    super(client, {
      name: "bunny",
      description: "Post a randomly selected image of a bunny.",
      category: "Animals",
      usage: "bunny",
      extended: "This command will return a beautiful bunny.",
      cost: 5,
      cooldown: 10,
    });
  }

  async run(message, args, level) { // eslint-disable-line no-unused-vars
    try {

      if (message.settings.socialSystem === "true") {
        if (!(await this.cmdPay(message, message.author.id, this.help.cost))) return;
      }

      const msg = await message.channel.send(`<a:typing:397490442469376001> **${message.member.displayName}** is petting a bunny...`);
      const { body } = await snekfetch.get("https://api.bunnies.io/v2/loop/random/?media=gif,png");
      await msg.edit({embed:{ "title": "Click here if the image failed to load.", "url": body.media.gif, "color":message.guild.me.roles.highest.color || 5198940, "image": {"url": body.media.gif}}});
    } catch (e) {
      console.log(e);
    }
  }
}

module.exports = Bunny;