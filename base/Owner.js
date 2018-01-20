const Command = require(`${process.cwd()}/base/Command.js`);
class Owner extends Command {

  constructor(client, options) {
    super(client, Object.assign(options, {
      hidden: true
    }));
  } 

}

module.exports = Owner;
