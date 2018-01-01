const Social = require(`${process.cwd()}/base/Social.js`);
const { get: fetch } = require("snekfetch");
const { MessageAttachment } = require("discord.js");

const animals = {
  "cat": {
    fetch: async () => fetch("http://random.cat/meow"),
    get: async (resp) => resp.body.file
  },
  "dog": {
    fetch: async (args) => {
      const url = args[1] ? `https://dog.ceo/api/breed/${args[1]}/images/random` : "https://dog.ceo/api/breeds/image/random";
      return fetch(url);
    },
    get: async (resp) => resp.body.message
  },
  "bunny": {
    fetch: async () => fetch("https://api.bunnies.io/v2/loop/random/?media=gif,png"),
    get: async (resp) => resp.body.media.poster
  },
  "bill": {
    fetch: async () => fetch("http://belikebill.azurewebsites.net/billgen-API.php?default=1"),
    get: async (resp) => resp.body
  },
  "bird": {
    fetch: async () => fetch("http://random.birb.pw/tweet/"),
    get: async (resp) => `https://random.birb.pw/img/${resp.body}`
  }
};

class Random extends Social {
  constructor(client) {
    super(client, {
      name: "random",
      description: "Grabs a random image from some internet API.",
      category: "Fun",
      usage: "random <thing> []",
      extended: `The following api's are supported: ${Object.keys(animals).join(", ")}`,
      cost: 5,
      cooldown: 5,
      botPerms: ["ATTACH_FILES"]
    });
  }

  async run(message, args, level) { // eslint-disable-line no-unused-vars
    if (!args[0]) {
      return message.reply("Please give me a `thing` or choose one of these: " + Object.keys(animals).join(", "));
    }
    const api = animals[args[0]];
    try {
      const cost = this.cmdDis(this.help.cost, level);
      const payMe = await this.cmdPay(message, message.author.id, cost, this.conf.botPerms);
      if (!payMe) return;  
      if (!api) {
        const resp = await fetch(`http://loremflickr.com/400/300/${args[0]}`);
        return message.channel.send(new MessageAttachment(resp.body, `random${args[0]}.jpg`));
      }
    } catch (e) {
      console.log(e);
      message.response(undefined, "Sorry I couldn't find any valid API for that keyword, try again!");
    }

    const response = await api.fetch(args, message);
    const image = await api.get(response);
    message.channel.send({ files: [image] });
  }
}

module.exports = Random;