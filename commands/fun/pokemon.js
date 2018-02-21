const Command = require(`${process.cwd()}/base/Command.js`);
const { MessageEmbed } = require("discord.js");
const pokemon = require(`${process.cwd()}/assets/json/pokemon.json`);

class Pokemon extends Command {
  constructor(client) {
    super(client, {
      name: "pokemon",
      description: "Guess That Pokemon",
      usage: "pokemon",
      category: "Fun",
      aliases: ["guessthatpokemon"]
    });
  }

  async run(message, args, level) { // eslint-disable-line no-unused-vars
    const rand = Math.floor(Math.random() * 802);
    const poke = rand > 0 ? rand : Math.floor(Math.random() * 802);
    const pokem = pokemon[poke];

    const embed = new MessageEmbed()
      .setTitle("You have 15 seconds to guess ! Who's that Pokémon !")
      .setAuthor(message.member.displayName, message.author.displayAvatarURL())
      .setImage(pokem.imageURL)
      .setColor(message.guild.me.roles.highest.color || 0x00AE86);
    
    const msg = await message.channel.send({ embed });
    const filter = m => m.author.id === message.author.id;
    const attempts = await msg.channel.awaitMessages(filter, { time: 15000, max: 1 });
      
    if (!attempts || !attempts.size) {
      msg.delete();
      return message.channel.send(`Ba-Baka! You took too long to answer. It was ${pokem.name}.`);
    } 
      
    const answer = attempts.first().content.toLowerCase();  
      
    if (answer === pokem.name.toLowerCase()) {
      await msg.edit({embed: null});
      return msg.channel.send(`Yatta! Well done, ${pokem.name} was correct.`);
    }
    await msg.edit({embed: null});
    return msg.channel.send(`Ba-Baka! You answered incorrectly, It was **${pokem.name}.**`);
  } 
}

module.exports = Pokemon;
