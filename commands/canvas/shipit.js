const Social = require("../../structures/Social.js");
const { get } = require("snekfetch");

class ShipIt extends Social {
  constructor(...args) {
    super(...args, {
      name: "shipit",
      description: "Who do you ship?.",
      usage: "shipit <mention>",
      category: "Canvas",
      cost: 5,
      cooldown: 5,
      loadingString: "<a:typing:397490442469376001> **{{displayName}}** is shipping it...",
      botPerms: ["EMBED_LINKS"]
    });
  }


  async run(message, args, level, loadingMessage) {
    const shipped = message.mentions.members.size === 2 ? message.mentions.members.array()[1] : message.member;
    const shipper = message.mentions.members.size === 1 || message.mentions.members.size === 2 ? message.mentions.members.array()[0] : message.member;
    const first_length = Math.round(shipper.displayName.length / 2);
    const first_half = shipper.displayName.slice(0, first_length);
    const second_length = Math.round(shipped.displayName.length / 2);
    const second_half = shipped.displayName.slice(second_length);
    const final_name = first_half + second_half;
    const score = Math.random() * (0, 100);
    const prog_bar = Math.ceil(Math.round(score) / 100 * 10);
    const counter = "▰".repeat(prog_bar) + "▱".repeat(10 - prog_bar);

    const { body } = await get(`https://nekobot.xyz/api/imagegen?type=ship&user1=${shipper.user.displayAvatarURL({ format: "png", size: 256 })}&user2=${shipped.user.displayAvatarURL({ format: "png", size: 256 })}`);

    return loadingMessage.edit({
      embed: {
        "title": `${shipper.displayName} ❤ ${shipped.displayName}`,
        "description": `**Love %**\n${counter}\n\n${final_name}`,
        "url": body.message,
        "color": 6192321,
        "image": {
          "url": body.message
        },
        "footer": {
          "icon_url": message.author.displayAvatarURL({ format: "png", size: 32 }),
          "text": `Requested by ${message.author.tag} | Powered by NekoBot API`
        }
      }
    });
  }

}
module.exports = ShipIt;
