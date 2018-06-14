const Social = require("../../structures/Social.js");

const { MessageAttachment } = require("discord.js");
const { get } = require("snekfetch");

class Profile extends Social {
  constructor(...args) {
    super(...args, {
      name: "profile",
      description: "Get your user profile.",
      usage: "profile",
      guildOnly: true,
      cooldown: 10,
      loadingString: "<a:typing:397490442469376001> **{{displayName}}** is looking at profiles.",
    });
  }

  cmdVerify(message, args, loadingMessage) {
    return this.verifyMember(message, message.mentions.members.size === 1 ? message.mentions.members.first() : message.member, { msg: loadingMessage });
  }
    
  async run(message, args, level, loadingMessage) { // eslint-disable-line no-unused-vars
    const member = await this.cmdVerify(message, args, loadingMessage);
    const name = member.displayName.length > 15 ? member.displayName.substring(0, 12) + "..." : member.displayName;
    const { body } = await get(`https://dev.anidiots.guide/profiles/misaki?name=${name}&score=${JSON.stringify(member.score)}&avatar=${member.user.displayAvatarURL({ format: "png", size: 128 })}`).set("Authorization", process.env.IDIOTAPI);
    await message.channel.send(new MessageAttachment(Buffer.from(body), `profile-${member.id}.jpg`));
    await loadingMessage.delete();
  }
}

module.exports = Profile;
