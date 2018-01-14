const Social = require(`${process.cwd()}/base/Social.js`);
const fsn = require("fs-nextra");

const alternateCase = (string) => {
  const chars = string.toUpperCase().split("");
  for (let i = 0; i < chars.length; i += 2) {
    chars[i] = chars[i].toLowerCase();
  }
  return chars.join("");
};

class Mock extends Social {
  constructor(client) {
    super(client, {
      name: "mock",
      description: "Mocks a nominated message.",
      usage: "mock",
      category: "Fun",
      extended: "Based on the popular Spongebob Squarepants mocking meme.",
      cost: 10,
      cooldown: 10
    });
  }

  async run(message, args, level) { // eslint-disable-line no-unused-vars 
    try {
      const grabMock = args.length === 0 ? await message.channel.messages.fetch({ limit:1, before: message.id}) : await message.channel.messages.fetch(await this.verifyMessage(message, args[0]));
      const mockBob = await fsn.readFile("./assets/images/spongebob.png");
      const mock = grabMock.size === 1 ? grabMock.first() : grabMock;
      if (mock.author.bot) return message.response(undefined, "You cannot mock bots.");
      if (message.settings.socialSystem === "true") {
        if (!(await this.cmdPay(message, message.author.id, this.help.cost))) return;
      }
      await message.channel.send(alternateCase(mock.cleanContent), {files: [{attachment: mockBob, name: "mock.png"}]});
    } catch (error) {
      this.client.logger.error(error);
    }
  }
}

module.exports = Mock;