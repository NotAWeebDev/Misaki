const Social = require("../../structures/Social.js");
const { get } = require("snekfetch");

class Butts extends Social {
  constructor(...args) {
    super(...args, {
      name: "butts",
      description: "Baby got back.",
      category: "NSFW",
      usage: "butts",
      extended: "This command will return butts.",
      cost: 40,
      cooldown: 10,
      aliases: ["buttocks","behind","rear","rear-end","backside","posterior","hind-quarters","hinder","heinie","derrière","rump","caboose","tail","tail-end","tail-bone","tail-feather","applebottom","ass","arse","badonkadonk","booty","breeches","britches","tush","tushy","tokus","seat","moon","haunches","hams","fanny","dumper","dump","culo","cheeks","buns","cakes","can","bum","keister","duff","fundament","hunkers","nates","trunk","stern","glutes","pooper","patootie","sit-upon","cushion","wazoo","bop","bumper","dumps","humps","bubbles","back"]
    });
  }

  async run(message, args, level) { // eslint-disable-line no-unused-vars
    if (!message.channel.nsfw) return message.response("🔞", "Cannot display NSFW content in a SFW channel.");
    const msg = await message.channel.send(`<a:typing:397490442469376001> **${message.member.displayName}** is looking for butts...`);
    const { body } = await get("http://api.obutts.ru/butts/0/1/random");
    await msg.edit({
      embed: {
        "title": "Click here if the image failed to load.",
        "url": `http://media.obutts.ru/${body[0].preview}`,
        "color": 6192321,
        "image": {
          "url": `http://media.obuttss.ru/${body[0].preview}`
        },
        "footer": {
          "icon_url": message.author.displayAvatarURL({ format: "png", size: 32 }),
          "text": `Requested by ${message.author.tag} | Powered by obutts.ru`
        }
      }
    });
  }
}

module.exports = Butts;