require(`${process.cwd()}/modules/Prototypes.js`);
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

client.on("disconnect", () => client.logger.warn("Bot is disconnecting..."))
  .on("reconnect", () => client.logger.log("Bot reconnecting...", "log"))
  .on("error", e => client.logger.error(e))
  .on("warn", info => client.logger.warn(info));

process.on("uncaughtException", (err) => {
  const errorMsg = err.stack.replace(new RegExp(`${__dirname}/`, "g"), "./");
  client.logger.error(`Uncaught Exception: ${errorMsg}`);
  process.exit(1);
});

process.on("unhandledRejection", err => console.log(err));
