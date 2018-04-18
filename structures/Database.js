const Sequelize = require("sequelize");
const { PGUSER, PGPASS, PGDATA, PGHOST, PGPORT } = process.env;

class Database {
  constructor(client) {
    this.client = client;

    this.db = new Sequelize({
      database: PGDATA,
      username: PGUSER,
      password: PGPASS,
      host: PGHOST,
      port: PGPORT,
      dialect: "postgres",
      logging: false
    });

    this.inventory = this.db.define("inventory", this.inventorySchema);
    this.reminders = this.db.define("reminders", this.remindersSchema);
    this.store = this.db.define("store", this.storeSchema);
    this.settings = this.db.define("settings", this.settingsSchema);
    this.points = this.db.define("points", this.pointsSchema);
  }

  _ready() {
    this.db.authenticate()
      .then(() => this.client.console.log("[DATABASE]: Connection has been established successfully."))
      .then(() => this.db.sync()
        .then(() => this.client.console.log("[DATABASE]: Done Synchronizing database!"))
        .catch(error => this.client.console.error(`[DATABASE]: Error synchronizing the database: \n${error}`))
      ).catch(error => {
        this.client.console.error(`[DATABASE]: Unable to connect to the database: \n${error}`);
        this.client.console.log("[DATABASE]: Try reconnecting in 10 seconds...");
        setTimeout(() => this._ready(), 10000);
      });
  }

  get settingsSchema() {
    return {
      id: { // This is the guild ID, it's unique.
        type: Sequelize.STRING,
        primaryKey: true,
        allowNull: false,
        unique: true
      },
      prefix: { // This is the prefix... duh.
        type: Sequelize.STRING,
        defaultValue: "m.",
        allowNull: false
      },
      modRole: { // The name of the Moderator role.
        type: Sequelize.STRING,
        defaultValue: "Moderator",
        allowNull: false
      },
      adminRole: { // The name of the Administrator role.
        type: Sequelize.STRING,
        defaultValue: "Administrator",
        allowNull: false
      },
      systemNotice: { // This is like if a user attempts to use a command they're not allowed, for example a regular member tries to use eval.
        type: Sequelize.BOOLEAN,
        defaultValue: true,
        allowNull: false
      },
      welcomeEnabled: { // Welcome messages
        type: Sequelize.BOOLEAN,
        defaultValue: false,
        allowNull: false
      },
      welcomeChannel: { // Where to post the welcome messages.
        type: Sequelize.STRING,
        defaultValue: "welcome",
        allowNull: false
      },
      welcomeType: { // What kind of welcome message is it? is it an image? is it text?
        type: Sequelize.STRING,
        defaultValue: "text",
        allowNull: false
      },
      socialSystem: { // The entire economy system
        type: Sequelize.BOOLEAN,
        defaultValue: false,
        allowNull: false
      },
      levelNotice: { // Level up messages
        type: Sequelize.BOOLEAN,
        defaultValue: false,
        allowNull: false
      },
      socialInventory: { // Guild Member inventories
        type: Sequelize.BOOLEAN,
        defaultValue: false,
        allowNull: false
      },
      socialStore: { // Guild stores, where you can buy tokens and roles.
        type: Sequelize.BOOLEAN,
        defaultValue: false,
        allowNull: false
      },
      dailyEnabled: { // Is the daily command enabled?
        type: Sequelize.BOOLEAN,
        defaultValue: true,
        allowNull: false
      },
      dailyTime: { // How many hours between claiming dailies?
        type: Sequelize.INTEGER,
        defaultValue: 24,
        allowNull: false
      },
      dailyPoints: { // How many points you can get for your daily.
        type: Sequelize.INTEGER,
        defaultValue: 250,
        allowNull: false
      },
      chatEarningEnabled: { // This allows users to earn just by chatting.
        type: Sequelize.BOOLEAN,
        defaultValue: false,
        allowNull: false
      },
      minPoints: { // The lowest amount of points you can earn.
        type: Sequelize.INTEGER,
        defaultValue: 1,
        allowNull: false
      },
      maxPoints: { // The highest amount of points you can earn.
        type: Sequelize.INTEGER,
        defaultValue: 20,
        allowNull: false
      },
      commandPaying: { // Do you pay for commands?
        type: Sequelize.BOOLEAN,
        defaultValue: false,
        allowNull: false
      },
      tokenPrice: { // How much are casino tokens?
        type: Sequelize.INTEGER,
        defaultValue: 100,
        allowNull: false
      }
    };
  }

  get pointsSchema() {
    return {
      id: { // Unique ID created by combining the guild id and user id `${guild.id}-${user.id}`
        type: Sequelize.STRING,
        primaryKey: true,
        allowNull: false,
        unique: true
      },
      points: { // How many points the member has earned.
        type: Sequelize.INTEGER,
        defaultValue: 0,
        allowNull: false,
      },
      level: { // What level the member is.
        type: Sequelize.INTEGER,
        defaultValue: 0,
        allowNull: false,
      },
      user: { // User ID
        type: Sequelize.STRING,
        allowNull: false,
      },
      guild: { // Guild ID
        type: Sequelize.STRING,
        allowNull: false,
      },
      daily: { // This is a timestamp of when they claimed their daily.
        type: Sequelize.STRING,
        defaultValue: 0,
        allowNull: false,
      }
    };
  }

  get storeSchema() {
    return {
      id: { // ID of the role.
        type: Sequelize.STRING,
        primaryKey: true,
        allowNull: false,
        unique: true
      },
      name: { // Name of the role.
        type: Sequelize.STRING,
        allowNull: false
      },
      price: { // Price of the role.
        type: Sequelize.INTEGER,
        defaultValue: 0,
        allowNull: false
      },
      guildId: { // Home of the role.
        type: Sequelize.STRING,
        allowNull: false
      }
    };
  }

  get inventorySchema() {
    return {
      id: { // Unique ID created by combining the guild id and user id `${guild.id}-${user.id}`
        type: Sequelize.STRING,
        primaryKey: true,
        allowNull: false,
        unique: true
      },
      keys: { // How many keys they own.
        type: Sequelize.INTEGER,
        defaultValue: 0,
        allowNull: false
      },
      crates: { // How many crates they own.
        type: Sequelize.INTEGER,
        defaultValue: 0,
        allowNull: false
      },
      tokens: { // How many tokens they own.
        type: Sequelize.INTEGER,
        defaultValue: 0,
        allowNull: false
      }
    };
  }

  get remindersSchema() {
    return {
      id: { // Unique ID created by combining the user id and timestamp of when the reminder was created `${user.id}-${message.createdAt}`.
        type: Sequelize.STRING,
        primaryKey: true,
        allowNull: false,
        unique: true
      },
      guildid: { // The guild ID for the reminder.
        type: Sequelize.STRING,
        allowNull: false
      },
      reminder: { // The reminder text.
        type: Sequelize.STRING,
        allowNull: false
      },
      reminderTimestamp: { // The timestamp the reminder should trigger at.
        type: Sequelize.STRING,
        allowNull: false
      }
    };
  }


}

module.exports = Database;