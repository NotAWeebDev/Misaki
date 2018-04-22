const Owner = require('../../structures/Owner.js');
const {
  inspect
} = require('util');
const {
  post
} = require('snekfetch');
const {
  MessageAttachment
} = require('discord.js');

class Eval extends Owner {
  constructor(...args) {
    super(...args, {
      name: 'eval',
      description: 'Evaluates arbitrary Javascript.',
      category: 'Owner',
      usage: 'eval <expression>',
      aliases: ['ev'],
      permLevel: 'Bot Owner'
    });
  }

  async run(message, args) {
    const code = args.map(a => a.startsWith('--') ? '' : a).join(' ');

    const silent = message.flags.includes('silent');

    const {
      success,
      result,
      time,
      type
    } = await this.eval(message, code);

    const token = this.client.token.split('').join('[^]{0,2}');
    const rev = this.client.token.split('').reverse().join('[^]{0,2}');
    const filter = new RegExp(`${token}|${rev}`, 'g');

    if (silent) return null;

    let output = `${success ? '**Output:**' : '**Error:**'}\n\`\`\`js\n${result.toString().replace(filter, '[TOKEN]')}\`\`\`\n**Type:** \`\`\`js\n${type}\`\`\`\n${time}`;

    if (output.length < 2000) {
      message.channel.send(output);
    } else {
      try {
        const {
          body
        } = await post('https://www.hastebin.com/documents').send(result);
        return message.channel.send(`Output was to long so it was uploaded to hastebin https: //www.hastebin.com/${body.key}.js`);
      } catch (error) {
        message.channel.send(`I tried to upload the output to hastebin but encountered this error ${error.name}:${error.message}`);
        if (message.guild && message.channel.attachable) {
          return await message.channel.send(new MessageAttachment(Buffer.from(output), success ? 'output.txt' : 'error.txt'));
        }
      }
    }
  }

  clean(text) {
    return text
      .replace(/`/g, '`' + String.fromCharCode(8203))
      .replace(/@/g, '@' + String.fromCharCode(8203));
  }

  async eval(message, code) {
    const async = message.flags.includes('async') ? true : false;
    const stack = message.flags.includes('stack') ? true : false;
    const startTime = new Date();

    let success, syncTime, asyncTime, result;

    try {
      if (async) code = `(async () => {\n${code}\n})();`;
      result = eval(code);
      syncTime = new Date() - startTime;
      success = true;
    } catch (error) {
      if (!syncTime) syncTime = this.friendlyDuration(syncTime);
      if (!asyncTime) asyncTime = this.friendlyDuration(syncTime);
      result = stack ? error.stack : error;
      success = false;
    }

    if (success && typeof result !== 'string') {
      result = inspect(result, {
        depth: message.flags.depth ? parseInt(message.flags.depth) || 0 : 0,
        showHidden: Boolean(message.flags.showHidden)
      });
    }

    return {
      success,
      time: this.formatTime(syncTime, asyncTime),
      result,
      type: typeof result
    };
  }

  formatTime(syncTime, asyncTime) {
    return asyncTime ? `⏱ ${asyncTime}<${syncTime}>` : `⏱ ${syncTime}`;
  }

  friendlyDuration(time) {
    if (time >= 1000) return `${(time / 1000).toFixed(this.digits)}s`;
    if (time >= 1) return `${time.toFixed(this.digits)}ms`;
    return `${(time * 1000).toFixed(this.digits)}μs`;
  }
}

module.exports = Eval;
