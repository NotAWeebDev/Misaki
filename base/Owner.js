const Command = require("./Command.js");
class Owner extends Command {

  constructor(client, file, options = {}) {
    super(client, file, Object.assign(options, {
      hidden: true,
      permLevel: "Bot Owner"
    }));
  } 

}

module.exports = Owner;
