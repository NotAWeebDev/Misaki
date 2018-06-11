const Social = require("../../structures/Social.js");
const { MessageAttachment } = require("discord.js");

class Filter extends Social {
  constructor(...args) {
    super(...args, {
      name: "filter",
      description: "Change the style of your avatar with these basic filters.",
      category: "Canvas",
      usage: "filter < -sepia [@mention] | -invert [@mention] | -greyscale [@mention] | -igrey [@mention] | -ithres [@mention] <number> | -threshold [@mention] <number> | -silhouette [@mention] | -darkness [@mention] <number> | -brightness [@mention] <number>>",
      cost: 10,
      cooldown: 10,
      aliases: ["flt"],
      loadingString: "<a:typing:397490442469376001> Applying **{{filterName}}**...",
      botPerms: ["ATTACH_FILES"]
    });
  }

  cmdVerify(message, args, loadingMessage) {
    return this.verifyUser(message, message.mentions.users.size === 1 ? message.mentions.users.first().id : message.author.id, { msg: loadingMessage });
  }

  async run(message, args, level, loadingMessage) {
    if (message.flags[0].length === 0) return message.channel.send(`Incorrect usage, try any of the following; \`${this.usage}\``);

    const person = await this.cmdVerify(message, args, loadingMessage);//(message.mentions.users.first() || message.author).displayAvatarURL({ format: "png", size: 2048 });
    if (message.mentions.users.size === 1) args.shift();
    switch (message.flags[0]) {
      case "sepia":
        await message.channel.send(new MessageAttachment(await this.client.idiotAPI.sepia(person.displayAvatarURL({ format: "png", size: 2048 })), `${message.author.id}-sepia.png`));
        await loadingMessage.delete();
        break;
      case "invert":
        await message.channel.send(new MessageAttachment(await this.client.idiotAPI.invert(person.displayAvatarURL({ format: "png", size: 2048 })), `${message.author.id}-invert.png`));
        await loadingMessage.delete();
        break;
      case "grayscale":
      case "greyscale":
        await message.channel.send(new MessageAttachment(await this.client.idiotAPI.greyscale(person.displayAvatarURL({ format: "png", size: 2048 })), `${message.author.id}-greyscale.png`));
        await loadingMessage.delete();
        break;
      case "igray":
      case "igrey":
        await message.channel.send(new MessageAttachment(await this.client.idiotAPI.iGrey(person.displayAvatarURL({ format: "png", size: 2048 })), `${message.author.id}-inverted-greyscale.png`));
        await loadingMessage.delete();
        break;
      case "silhouette":
        await message.channel.send(new MessageAttachment(await this.client.idiotAPI.silhouette(person.displayAvatarURL({ format: "png", size: 2048 })), `${message.author.id}-silhouette.png`));
        await loadingMessage.delete();
        break;
      case "ithres":
        await message.channel.send(new MessageAttachment(await this.client.idiotAPI.iThreshold(person.displayAvatarURL({ format: "png", size: 2048 }), args[0]), `${message.author.id}-inverted-threshold.png`));
        await loadingMessage.delete();
        break;
      case "thres":
      case "threshold":
        await message.channel.send(new MessageAttachment(await this.client.idiotAPI.threshold(person.displayAvatarURL({ format: "png", size: 2048 }), args[0]), `${message.author.id}-threshold.png`));
        await loadingMessage.delete();
        break;
      case "brightness":
        await message.channel.send(new MessageAttachment(await this.client.idiotAPI.brightness(person.displayAvatarURL({ format: "png", size: 2048 }), args[0]), `${message.author.id}-brightness.png`));
        await loadingMessage.delete();
        break;
      case "myoldfriend":
      case "darkness":
        await message.channel.send(new MessageAttachment(await this.client.idiotAPI.darkness(person.displayAvatarURL({ format: "png", size: 2048 }), args[0]), `${message.author.id}-darkness.png`));
        await loadingMessage.delete();
        break;
    }
  }
}

module.exports = Filter;
