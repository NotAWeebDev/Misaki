const Social = require(`${process.cwd()}/base/Social.js`);
const { get } = require("snekfetch");

class Waifu extends Social {
  constructor(client) {
    super(client, {
      name: "waifu",
      description: "Rate someone.",
      category: "Canvas",
      usage: "waifu @mention",
      extended: "Mention another user to post rate them.",
      cost: 10,
      cooldown: 10
    });
  }

  async run(message, args, level) { // eslint-disable-line no-unused-vars 
    const target = message.mentions.members;
    if (target.size === 0) return message.response(undefined, "You need to mention someone to rate them.");
    if (message.member == target.first()) return message.response(undefined, "You cannot rate yourself!");
    let msg;
    try {
      if (message.settings.socialSystem === "true") {
        if (!(await this.cmdPay(message, message.author.id, this.help.cost))) return;
      }
      msg = await message.channel.send(`<a:typing:397490442469376001> **${message.member.displayName}** looks at **${target.first().displayName}**, juding them...`);
      const { body } = await get(`https://dev.anidiots.guide/generators/waifuinsult/?avatar=${target.first().user.displayAvatarURL({ format: "png", size: 512 })}`).set("Authorization", this.client.config.apiTokens.idiotToken);
      await message.channel.send({ files: [{ attachment: Buffer.from(body.data), name: "waifu.jpg" }] });
      await msg.delete();
    } catch (error) {
      msg.edit("Something went wrong, please try again later");
      this.client.logger.error(error);
    }
  }
}

module.exports = Waifu;//