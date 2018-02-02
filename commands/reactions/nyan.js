const Social = require(`${process.cwd()}/base/Social.js`);

class Nyan extends Social {
  constructor(client) {
    super(client, {
      name: "nyan",
      description: "Someone needs a nyan in their life.",
      usage: "nyan",
      category: "Reactions",
      extended: "",
      cost: 5,
      aliases: ["glomp"]
    });
  }

  async run(message, args, level) { // eslint-disable-line no-unused-vars
    try {
      if (message.settings.socialSystem === "true") {
        if (!(await this.cmdPay(message, message.author.id, this.help.cost))) return;
      }
      const msg = await message.channel.send(`<a:typing:397490442469376001> **${message.member.displayName}** wants a nyan...`);
      const nyan = await this.cmdMoe("nyan");
      await msg.edit({
        embed: {
          "title": "Click here if the image failed to load.",
          "url": `https://cdn.ram.moe/${nyan}`,
          "color": message.guild.me.roles.highest.color || 5198940,
          "image": {
            "url": `https://cdn.ram.moe/${nyan}`
          }
        }
      });
    } catch (e) {
      console.log(e);
    }

  }
}

module.exports = Nyan;
