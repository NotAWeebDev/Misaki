const Social = require(`${process.cwd()}/base/Social.js`);
const snekfetch = require("snekfetch");

class Owo extends Social {
  constructor(client) {
    super(client, {
      name: "owo",
      description: "OwO, what's this?",
      usage: "owo",
      category: "Fun",
      cost: 5,
      aliases: ["uwu", "UwU", "OwO"]
    });
  }

  async run(message, args, level) { // eslint-disable-line no-unused-vars
    try {
      if (message.settings.socialSystem === "true") {
        if (!(await this.cmdPay(message, message.author.id, this.help.cost))) return;
      }
      const msg = await message.channel.send(`<a:typing:397490442469376001> OwO whats this? **${message.member.displayName}**...`);
      const { body } = await snekfetch.get("https://rra.ram.moe/i/r?type=owo");
      await msg.edit({
        embed: {
          "title": "Click here if the image failed to load.",
          "url": `https://cdn.ram.moe/${body.path.replace("/i/", "")}`,
          "color": message.guild.me.roles.highest.color || 5198940,
          "image": {
            "url": `https://cdn.ram.moe/${body.path.replace("/i/", "")}`
          }
        }
      });
    } catch (e) {
      console.log(e);
    }

  }
}

module.exports = Owo;
