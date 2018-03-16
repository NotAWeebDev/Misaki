require("dotenv").load();
require(`${process.cwd()}/modules/Prototypes.js`);
require(`${process.cwd()}/extenders/Message.js`);
require(`${process.cwd()}/extenders/GuildMember.js`);
require(`${process.cwd()}/extenders/Guild.js`);
require(`${process.cwd()}/extenders/DMChannel.js`);
require(`${process.cwd()}/extenders/TextChannel.js`);
const MisakiClient = require(`${process.cwd()}/structures/MisakiClient.js`);

const client = new MisakiClient({
  disabledEvents: [
    "CHANNEL_PINS_UPDATE",
    "GUILD_BAN_ADD",
    "GUILD_BAN_REMOVE",
    "GUILD_SYNC",
    "RELATIONSHIP_ADD",
    "RELATIONSHIP_REMOVE",
    "TYPING_START",
    "USER_NOTE_UPDATE",
    "USER_SETTINGS_UPDATE",
    "VOICE_SERVER_UPDATE",
    "VOICE_STATE_UPDATE"],
  disableEveryone: true,
  messageCacheMaxSize: 100,
  messageCacheLifetime: 240,
  messageSweepInterval: 300
});

client.login(process.env.DISCORD);

client.on("disconnect", () => client.console.warn("Bot is disconnecting..."))
  .on("reconnect", () => client.console.log("Bot reconnecting..."))
  .on("error", err => client.console.error(err))
  .on("warn", info => client.console.warn(info));

process.on("uncaughtException", err => {
  const errorMsg = err.stack.replace(new RegExp(`${__dirname}/`, "g"), "./");
  client.console.error(`Uncaught Exception: ${errorMsg}`);
  process.exit(1);
});

process.on("unhandledRejection", console.log);
