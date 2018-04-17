const Social = require("./Social.js");

class NSFW extends Social {

  constructor(client, file, options = {}) {
    super(client, file, Object.assign(options, { guildOnly: true }));
    this.loadingString = options.loadingString;
  }

  verifyNSFW(channel) {
    if (channel.nsfw || channel.name.startsWith("nsfw-") || channel.name.startsWith("nsfw_")) return true;
    else return false;
  }

  checkBlacklist(search) {
    if (["loli", "shota", "cub", "young", "child", "baby", "guro", "gore", "vore"].includes(search.toLowerCase())) return true;
    else return false;
  }
}

module.exports = NSFW;
