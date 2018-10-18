require("dotenv").config();
require("./util/Prototypes.js");
require("./extenders/Message.js");
require("./extenders/GuildMember.js");
require("./extenders/Guild.js");
require("./extenders/DMChannel.js");
require("./extenders/TextChannel.js");
const MisakiClient = require("./structures/MisakiClient.js");
const errorDirnameRegex = new RegExp(`${__dirname}/`, "g");

const client = new MisakiClient({
  disabledEvents: ["CHANNEL_PINS_UPDATE", "GUILD_BAN_ADD", "GUILD_BAN_REMOVE", "RELATIONSHIP_ADD", "RELATIONSHIP_REMOVE", "TYPING_START", "VOICE_SERVER_UPDATE", "VOICE_STATE_UPDATE"],
  disableEveryone: true,
  messageCacheMaxSize: 100,
  messageCacheLifetime: 240,
  messageSweepInterval: 300,
  shardCount: "auto"
});

client.login(process.env.DISCORD);

client.on("disconnect", () => client.console.warn("Bot is disconnecting..."))
  .on("reconnecting", () => client.console.log("Bot reconnecting..."))
  .on("error", err => client.console.error(err))
  .on("warn", info => client.console.warn(info));

process.on("uncaughtException", err => {
  const errorMsg = err.stack.replace(errorDirnameRegex, "./");
  client.console.error(`Uncaught Exception: ${errorMsg}`);
  process.exit(1);
});

process.on("unhandledRejection", client.console.error);
