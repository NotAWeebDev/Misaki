const Social = require(`${process.cwd()}/base/Social.js`);
const snekfetch = require("snekfetch");
const { URLSearchParams } = require("url");

class Meme extends Social {

  constructor(client, options) {
    super(client, Object.assign(options, {
      guildOnly: true
    }));
  } 

  async twoMeme(template_id, text, font = "impact", max_font_size = "50px") {
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
    params.append("username", this.client.config.apiTokens.imgflipUser);
    params.append("password", this.client.config.apiTokens.imgflipPass);
    params.append("font", font);
    params.append("max_font_size", max_font_size);
    params.append("text0", text0);
    params.append("text1", text1);

    const { body } = await snekfetch.post(`https://api.imgflip.com/caption_image?${params}`);
    return body.data.url;
  }

  async fourMeme(template_id, text, font = "impact", max_font_size = "50px") {
    const params = new URLSearchParams();
    let first;
    let second;
    let third;
    let forth;
    if (text.includes("; ")) {
      [first, second, third, forth] = text.split("; ");
    } else {
      first = text;
      second = "";     
      third = "";
      forth = "";
    }
    params.append("template_id", template_id);
    params.append("username", this.client.config.apiTokens.imgflipUser);
    params.append("password", this.client.config.apiTokens.imgflipPass);
    params.append("font", font);
    params.append("max_font_size", max_font_size);
    params.append("boxes[0][text]", first);
    params.append("boxes[1][text]", second);
    params.append("boxes[2][text]", third);
    params.append("boxes[3][text]", forth);

    const { body } = await snekfetch.post(`https://api.imgflip.com/caption_image?${params}`);
    return body.data.url;
  }

}

module.exports = Meme;
