const Social = require(`${process.cwd()}/base/Social.js`);
const { MessageAttachment } = require("discord.js");
//-ithres [@mention] <number> | -threshold [@mention] <number> | 
class Filter extends Social {
  constructor(client) {
    super(client, {
      name: "filter",
      description: "Change the style of your avatar with these basic filters.",
      category: "Canvas",
      usage: "filter < -sepia [@mention] | -invert [@mention] | -greyscale [@mention] | -igrey [@mention] | -silhouette [@mention] | -darkness [@mention] <number> | -brightness [@mention] <number>>",
      cost: 10,
      cooldown: 10,
      aliases: ["flt"],
      loadingString: "<a:typing:397490442469376001> Applying **{{filterName}}**..."
    });
  }

  cmdVerify(message, args, loadingMessage) {
    return this.verifyUser(message, message.mentions.users.size === 1 ? message.mentions.users.first().id : message.author.id, { msg: loadingMessage });
  }

  async run(message, args, loadingMessage) {
    
    const person = await this.cmdVerify(message, args, loadingMessage);//(message.mentions.users.first() || message.author).displayAvatarURL({ format: "png", size: 2048 });
    if (message.mentions.users.size === 1) args.shift();
    let msg;
    switch (message.flags[0]) {
      case "sepia":
        msg = await message.channel.send("<a:typing:397490442469376001> Applying sepia filter...");
        await message.channel.send(new MessageAttachment(await this.client.idiotAPI.sepia(person.displayAvatarURL({ format: "png", size: 2048 })), `${message.author.id}-sepia.png`));
        await msg.delete();
        break;
      case "invert":
        msg = await message.channel.send("<a:typing:397490442469376001> Applying invert filter...");
        await message.channel.send(new MessageAttachment(await this.client.idiotAPI.invert(person.displayAvatarURL({ format: "png", size: 2048 })), `${message.author.id}-invert.png`));
        await msg.delete();
        break;
      case "grayscale":
      case "greyscale":
        msg = await message.channel.send("<a:typing:397490442469376001> Applying greyscale filter...");
        await message.channel.send(new MessageAttachment(await this.client.idiotAPI.greyscale(person.displayAvatarURL({ format: "png", size: 2048 })), `${message.author.id}-greyscale.png`));
        await msg.delete();
        break;
      case "igray":
      case "igrey":
        msg = await message.channel.send("<a:typing:397490442469376001> Applying invert greyscale filter...");
        await message.channel.send(new MessageAttachment(await this.client.idiotAPI.iGrey(person.displayAvatarURL({ format: "png", size: 2048 })), `${message.author.id}-inverted-greyscale.png`));
        await msg.delete();
        break;
      case "silhouette":
        msg = await message.channel.send("<a:typing:397490442469376001> Applying silhouette filter...");
        await message.channel.send(new MessageAttachment(await this.client.idiotAPI.silhouette(person.displayAvatarURL({ format: "png", size: 2048 })), `${message.author.id}-silhouette.png`));
        await msg.delete();
        break;
      // case "ithres":
      //   msg = await message.channel.send("<a:typing:397490442469376001> Applying inverted threshold filter...");
      //   await message.channel.send(new MessageAttachment(await this.client.idiotAPI.iThreshold(person.displayAvatarURL({ format: "png", size: 2048 }), args[0]), `${message.author.id}-inverted-threshold.png`));
      //   await msg.delete();
      //   break;
      // case "thres":
      // case "threshold":
      //   msg = await message.channel.send("<a:typing:397490442469376001> Applying threshold filter...");
      //   await message.channel.send(new MessageAttachment(await this.client.idiotAPI.threshold(person.displayAvatarURL({ format: "png", size: 2048 }), args[0]), `${message.author.id}-threshold.png`));
      //   await msg.delete();
      //   break;
      case "brightness":
        msg = await message.channel.send("<a:typing:397490442469376001> Applying brightness filter...");
        await message.channel.send(new MessageAttachment(await this.client.idiotAPI.brightness(person.displayAvatarURL({ format: "png", size: 2048 }), args[0]), `${message.author.id}-brightness.png`));
        await msg.delete();
        break;
      case "myoldfriend":
      case "darkness":
        msg = await message.channel.send("<a:typing:397490442469376001> Applying darkness filter...");
        await message.channel.send(new MessageAttachment(await this.client.idiotAPI.darkness(person.displayAvatarURL({ format: "png", size: 2048 }), args[0]), `${message.author.id}-darkness.png`));
        await msg.delete();
        break;
    
      default:
        break;
    }
  }
}

module.exports = Filter;
