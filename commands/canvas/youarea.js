const Social = require("../../structures/Social.js");
const { get } = require("snekfetch");
const { MessageAttachment } = require("discord.js");

class YouAreA extends Social {
  constructor(...args) {
    super(...args, {
      name: "youarea",
      description: "",
      usage: "youarea",
      category: "Fun",
      cost: 5,
      aliases: ["ura"],
      loadingString: "<a:typing:397490442469376001> **{{displayName}}** thinks you are a...",
      botPerms: ["ATTACH_FILES"]
    });
  }

  async run(message, args, level, loadingMessage) {
    const text = args.join(" ").toUpperCase();
    const { body } = await get("https://i.ode.bz/auto/nichijou")
      .query({ text });

    await message.channel.send(new MessageAttachment(body, `${text}.gif`));
    await loadingMessage.delete();
  }
}

module.exports = YouAreA;
