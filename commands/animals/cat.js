const Social = require(`${process.cwd()}/base/Social.js`);
const { get } = require("snekfetch");
const { version } = require(`${process.cwd()}/package.json`);

class Cat extends Social {
  constructor(...args) {
    super(...args, {
      name: "cat",
      description: "Post a randomly selected image of a cat.",
      category: "Animals",
      usage: "cat",
      extended: "This command will return a beautiful cat.",
      cost: 5,
      cooldown: 10,
      aliases: ["kitten"],
      loadingString: "<a:typing:397490442469376001> **{{displayName}}** is petting a cat..."
    });
  }

  async run(message, args, level, loadingMessage) {
    const { body } = await get("https://api.weeb.sh/images/random?type=animal_cat")
      .set("Authorization", `Wolke ${process.env.WEEBSH}`)
      .set("User-Agent", `Misaki/${version}/${this.client.user.id === "396323622953680910" ? "Production" : "Development"}`);

    await loadingMessage.edit({
      embed: {
        "title": "Click here if the image failed to load.",
        "url": body.url,
        "color": message.guild.me.roles.highest.color || 5198940,
        "image": {
          "url": body.url
        }
      }
    });
  }
}

module.exports = Cat;