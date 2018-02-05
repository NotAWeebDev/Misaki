const Social = require(`${process.cwd()}/base/Social.js`);
const { get } = require("snekfetch");
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

    const msg = await message.channel.send(`<a:typing:397490442469376001> **${message.member.displayName}** is petting a bunny...`);

    if (message.settings.socialSystem === "true") {
      await this.cmdPay(message, message.author.id, this.help.cost, { msg });
    }

    const { body } = await get("https://api.bunnies.io/v2/loop/random/?media=gif,png");
    await msg.edit({embed:{ "title": "Click here if the image failed to load.", "url": body.media.gif, "color":message.guild.me.roles.highest.color || 5198940, "image": {"url": body.media.gif}}});
  }
}

module.exports = Bunny;