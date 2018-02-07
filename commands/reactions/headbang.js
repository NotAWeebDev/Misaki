const Social = require(`${process.cwd()}/base/Social.js`);

class Banghead extends Social {
  constructor(client) {
    super(client, {
      name: "banghead",
      description: "AAARGHHH!",
      usage: "banghead",
      category: "Reactions",
      cost: 5,
    });
  }

  async run(message, args, level) { // eslint-disable-line no-unused-vars
    const msg = await message.channel.send(`<a:typing:397490442469376001> **${message.member.displayName}** thinks a palm isn't enough.`);
    const banghead = await this.cmdWeeb("banghead", "gif", message.channel.nsfw);
    await msg.edit({
      embed: {
        "title": "Click here if the image failed to load.",
        "url": banghead,
        "color": message.guild.me.roles.highest.color || 5198940,
        "image": {
          "url": banghead
        }
      }
    });

  }
}

module.exports = Banghead;
