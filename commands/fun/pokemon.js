const Command = require(`${process.cwd()}/base/Command.js`);
const { MessageEmbed } = require("discord.js");
const HTMLParser = require("fast-html-parser");
const snek = require("snekfetch");

class Pokemon extends Command {
  constructor(client) {
    super(client, {
      name: "pokemon",
      description: "Guess That Pokemon",
      usage: "pokemon",
      aliases: ["poke"]
    });
  }

  async run(message, args, level) { // eslint-disable-line no-unused-vars
    const rand = Math.floor(Math.random() * 802);
    let poke = rand > 0 ? rand : Math.floor(Math.random() * 802);
    poke = poke.toString().padStart(3, "0");
    
    try {
      const res = await snek.get(`https://pokemondb.net/pokedex/${poke}`);
      const root = HTMLParser.parse(res.text);
      const RawImage = root.querySelector(".figure");
      const Image = RawImage.childNodes[1].rawAttrs.split("\" width")[0].split("=\"")[1];
      const RawTitle = root.querySelector("title");
      const pokeName = RawTitle.childNodes[0].rawText.split(" Pokédex:")[0];
      
      const embed = new MessageEmbed()
        .setTitle("You have 15 seconds to guess ! Who's that Pokémon !")
        .setAuthor(message.member.displayName, message.author.displayAvatarURL())
        .setImage(Image)
        .setColor(message.guild.me.roles.highest.color || 0x00AE86);
      
      const msg = await message.channel.send({ embed });
      const filter = m => m.author.id === message.author.id;
      const attempts = await msg.channel.awaitMessages(filter, { time: 15000, max: 1 });
      
      if (!attempts || !attempts.size) {
        msg.delete();
        return message.channel.send(`Ba-Baka! You took too long to answer. It was ${pokeName}.`);
      } 
      
      const answer = attempts.first().content.toLowerCase();  
      
      if (answer === pokeName.toLowerCase()) {
        await msg.delete();
        return msg.channel.sendFile(Image, `${pokeName}.png`, `Ba-Baka! Well done, ${pokeName} was correct.`);
      }
      await msg.delete();
      return msg.channel.sendFile(Image, `${pokeName}.png`, `Ba-Baka! You answered incorrectly, It was **${pokeName}.**`);
    } 
    catch (e) {
      console.log(e.stack);
    }
  }
}

module.exports = Pokemon;
