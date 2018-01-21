const Social = require(`${process.cwd()}/base/Social.js`);
const snekfetch = require("snekfetch");
const { URLSearchParams } = require("url");

class Meme extends Social {

  constructor(client, options) {
    super(client, Object.assign(options, {
      guildOnly: true
    }));
  } 

  async makeMeme(template_id, text) {
    const params = new URLSearchParams();
    let text0;
    let text1;
    if (text.includes("; ")) {
      [text0, text1] = text.split("; ");
    } else {
      text0 = text;
      text1 = "";
    }
    params.append("template_id", template_id);
    params.append("username", this.client.config.imgflipUser);
    params.append("password", this.client.config.imgflipPass);
    params.append("text0", text0);
    params.append("text1", text1);

    const { body } = await snekfetch.post(`https://api.imgflip.com/caption_image?${params}`);
    return body.data.url;
  }

}

module.exports = Meme;
