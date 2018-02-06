const Social = require(`${process.cwd()}/base/Social.js`);

class Gun extends Social {
  constructor(client) {
    super(client, {
      name: "gun",
      description: "AAARGHHH!",
      usage: "gun",
      category: "Reactions",
      cost: 5,
    });
  }

  async run(message, args, level) { // eslint-disable-line no-unused-vars
    try {
      if (message.settings.socialSystem === "true") {
        if (!(await this.cmdPay(message, message.author.id, this.help.cost))) return;
      }
      const msg = await message.channel.send(`<a:typing:397490442469376001> **${message.member.displayName}** needs a bigger gun.`);
      const bang = await this.cmdWeeb("bang", "gif", message.channel.nsfw);
      await msg.edit({
        embed: {
          "title": "Click here if the image failed to load.",
          "url": bang,
          "color": message.guild.me.roles.highest.color || 5198940,
          "image": {
            "url": bang
          }
        }
      });
    } catch (e) {
      console.log(e);
    }

  }
}

module.exports = Gun;
