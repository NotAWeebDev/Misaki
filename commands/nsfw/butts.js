const Social = require(`${process.cwd()}/base/Social.js`);
const snek = require("snekfetch");

class Butts extends Social {
  constructor(client) {
    super(client, {
      name: "butts",
      description: "Baby got back.",
      category: "NSFW",
      usage: "butts",
      extended: "This command will return butts.",
      cost: 40,
      cooldown: 10,
      guildOnly: true,
      aliases: ["buttocks","behind","rear","rear-end","backside","posterior","hind-quarters","hinder","heinie","derrière","rump","caboose","tail","tail-end","tail-bone","tail-feather","applebottom","ass","arse","badonkadonk","booty","breeches","britches","tush","tushy","tokus","seat","moon","haunches","hams","fanny","dumper","dump","culo","cheeks","buns","cakes","can","bum","keister","duff","fundament","hunkers","nates","trunk","stern","glutes","pooper","patootie","sit-upon","cushion","wazoo","bop","bumper","dumps","humps","bubbles","back"]
    });
  }

  async run(message, args, level) { // eslint-disable-line no-unused-vars
    try {
      if (!message.channel.nsfw) return message.response("🔞", "Cannot display NSFW content in a SFW channel.");

      if (!(await this.cmdPay(message, message.author.id, this.help.cost))) return;

      const msg = await message.channel.send(`<a:typing:397490442469376001> **${message.member.displayName}** is looking for butts...`);
      const { body } = await snek.get("http://api.obutts.ru/butts/0/1/random");
      message.buildEmbed()
        .setImage(`http://media.obutts.ru/${body[0].preview}`)
        .setTimestamp()
        .send();

      await msg.delete();
    } catch (e) {
      console.log(e);
    }
  }
}

module.exports = Butts;