const Social = require(`${process.cwd()}/base/Social.js`);

class Dance extends Social {
  constructor(client) {
    super(client, {
      name: "dance",
      description: "Someone needs to dance",
      usage: "dance [@mention]",
      category: "Reactions",
      cost: 5,
    });
  }

  async run(message, args, level) { // eslint-disable-line no-unused-vars
    const target = message.mentions.members;
    let response = "...";
    if (target.size !== 0) response = ` with **${target.first().displayName}**`;
    try {
      if (message.settings.socialSystem === "true") {
        if (!(await this.cmdPay(message, message.author.id, this.help.cost))) return;
      }
      const msg = await message.channel.send(`<a:typing:397490442469376001> **${message.member.displayName}** breaks out some dance moves${response}`);
      const dance = await this.cmdWeeb("dance", "gif", message.channel.nsfw);
      await msg.edit({
        embed: {
          "title": "Click here if the image failed to load.",
          "url": dance,
          "description": `**${message.member.displayName}** boogies${response}`,
          "color": message.guild.me.roles.highest.color || 5198940,
          "image": {
            "url": dance
          }
        }
      });
    } catch (e) {
      console.log(e);
    }

  }
}

module.exports = Dance;
