const Social = require(`${process.cwd()}/base/Social.js`);
const { get } = require("snekfetch");

class Bird extends Social {
  constructor(client) {
    super(client, {
      name: "bird",
      description: "Post a randomly selected image of a bird.",
      category: "Animals",
      usage: "bird",
      extended: "This command will return a beautiful bird.",
      cost: 5,
      cooldown: 10,
      aliases: ["birb"],
      loadingString: "<a:typing:397490442469376001> **{{displayName}}** is petting a bird..."
    });
  }

  async run(message, args, level, loadingMessage) { 
    const { body } = await get("http://random.birb.pw/tweet/");
    return loadingMessage.edit({
      embed: {
        "title": "Click here if the image failed to load.",
        "url": `https://random.birb.pw/img/${body}`,
        "color": message.guild.me.roles.highest.color || 5198940,
        "image": {
          "url": `https://random.birb.pw/img/${body}`
        }
      }
    });
  }
}

module.exports = Bird;