const Social = require(`${process.cwd()}/base/Social.js`);

class Lewd extends Social {
  constructor(client) {
    super(client, {
      name: "lewd",
      description: "Someone or something needs a lewd.",
      usage: "lewd [@mention]",
      category: "Reactions",
      cost: 5,
      aliases: []
    });
  }

  async run(message, args, level) { // eslint-disable-line no-unused-vars
    const target = message.mentions.members;
    let response = "this";
    if (target.size !== 0) response = `**${target.first().displayName}**`;
    try {
      if (message.settings.socialSystem === "true") {
        if (!(await this.cmdPay(message, message.author.id, this.help.cost))) return;
      }
      const msg = await message.channel.send(`<a:typing:397490442469376001> **${message.member.displayName}** thinks ${response} is a bit lewd...`);
      const lewd = await this.cmdMoe("lewd");
      await msg.edit({
        embed: {
          "title": "Click here if the image failed to load.",
          "url": `https://cdn.ram.moe/${lewd}`,
          "description": `**${message.member.displayName}** thinks ${response} is a bit lewd.`,
          "color": message.guild.me.roles.highest.color || 5198940,
          "image": {
            "url": `https://cdn.ram.moe/${lewd}`
          }
        }
      });
    } catch (e) {
      console.log(e);
    }

  }
}

module.exports = Lewd;
