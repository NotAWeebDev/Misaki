const Social = require(`${process.cwd()}/base/Social.js`);
const snekfetch = require("snekfetch");

class Duck extends Social {
  constructor(client) {
    super(client, {
      name: "duck",
      description: "Post a randomly selected image of a duck.",
      category: "Animals",
      usage: "duck",
      extended: "This command will return a beautiful duck.",
      cost: 5,
      cooldown: 10,
      aliases: []
    });
  }

  async run(message, args, level) { // eslint-disable-line no-unused-vars
    try {
      if (message.settings.socialSystem === "true") {
        if (!(await this.cmdPay(message, message.author.id, this.help.cost))) return;
      }
      const msg = await message.channel.send(`<a:typing:397490442469376001> **${message.member.displayName}** is petting a duck...`);
      const { body } = await snekfetch.get("https://random-d.uk/api/v1/random?type=gif");
      await msg.edit({
        embed: {
          "title": "Click here if the image failed to load.",
          "url": body.url,
          "color": message.guild.me.roles.highest.color || 5198940,
          "image": {
            "url": body.url
          },
          "footer": {
            "icon_url": message.author.displayAvatarURL({ size: 32 }),
            "text": `Requested by: ${message.author.tag} | ${body.message}`
          },
        }
      });
    } catch (e) {
      console.log(e);
    }
  }
}

module.exports = Duck;