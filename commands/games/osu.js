const Social = require("../../structures/Social.js");

const { MessageAttachment } = require("discord.js");
const { get } = require("snekfetch");

class OSU extends Social {
  constructor(...args) {
    super(...args, {
      name: "osu",
      description: "Get your osu profile.",
      usage: "osu <osu! username>",
      guildOnly: true,
      cooldown: 10,
      loadingString: "<a:typing:397490442469376001> **{{displayName}}** is looking at osu! profiles.",
    });
  }

  cmdVerify(message, args, loadingMessage) {
    return this.verifyMember(message, message.mentions.members.size === 1 ? message.mentions.members.first() : message.member, { msg: loadingMessage });
  }
    
  async run(message, args, level, loadingMessage) { // eslint-disable-line no-unused-vars
    const member = await this.cmdVerify(message, args, loadingMessage);
    const { body } = await get(`https://dev.anidiots.guide/generators/osu?user=${args.join(" ")}&theme=dark`).set("Authorization", process.env.IDIOTAPI);
    await message.channel.send(new MessageAttachment(Buffer.from(body), `osu-${member.id}.jpg`));
    await loadingMessage.delete();
  }
}

module.exports = OSU;
