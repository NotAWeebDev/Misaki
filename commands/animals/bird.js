const Social = require(`${process.cwd()}/base/Social.js`);
const { get } = require("snekfetch");
class Bird extends Social {
  constructor(client) {
    super(client, {
      name: "bird",
      description: "Post a randomly selected image of a bird.",
      category: "Animals",
      usage: "bird",
      extended: "This command will return a beautiful bird.",
      cost: 5,
      cooldown: 10,
      aliases: ["birb"]
    });
  }

  async run(message, args, level) { // eslint-disable-line no-unused-vars
    const msg = await message.channel.send(`<a:typing:397490442469376001> **${message.member.displayName}** is petting a bird...`);
    const { body } = await get("http://random.birb.pw/tweet/");
    await msg.edit({
      embed: {
        "title": "Click here if the image failed to load.",
        "url": `https://random.birb.pw/img/${body}`,
        "color": message.guild.me.roles.highest.color || 5198940,
        "image": {
          "url": `https://random.birb.pw/img/${body}`
        }
      }
    });
  }
}

module.exports = Bird;