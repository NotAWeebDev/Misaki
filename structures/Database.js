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

  get inventorySchema() {
    return {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false,
        unique: true
      },
      keys: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
        allowNull: false
      },
      crates: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
        allowNull: false
      },
      tokens: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
        allowNull: false
      }
    };
  }

  get remindersSchema() {
    return {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false,
        unique: true
      },
      guildid: {
        type: Sequelize.STRING,
        allowNull: false
      },
      reminder: {
        type: Sequelize.STRING,
        allowNull: false
      },
      reminderTimestamp: {
        type: Sequelize.STRING,
        allowNull: false
      }
    };
  }

  get storeSchema() {
    return {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false,
        unique: true
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      price: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
        allowNull: false
      },
      guildId: {
        type: Sequelize.STRING,
        allowNull: false
      }
    };
  }

  get settingsSchema() {
    return {
      id: {
        type: Sequelize.STRING,
        primaryKey: true,
        allowNull: false,
        unique: true
      },
      prefix: {
        type: Sequelize.STRING,
        defaultValue: "m.",
        allowNull: false
      },
      modRole: {
        type: Sequelize.STRING,
        defaultValue: "Moderator",
        allowNull: false
      },
      adminRole: {
        type: Sequelize.STRING,
        defaultValue: "Administrator",
        allowNull: false
      },
      systemNotice: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
        allowNull: false
      },
      welcomeEnabled: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
        allowNull: false
      },
      welcomeChannel: {
        type: Sequelize.STRING,
        defaultValue: "welcome",
        allowNull: false
      },
      welcomeType: {
        type: Sequelize.STRING,
        defaultValue: "text",
        allowNull: false
      },
      socialSystem: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
        allowNull: false
      },
      levelNotice: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
        allowNull: false
      },
      socialInventory: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
        allowNull: false
      },
      socialStore: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
        allowNull: false
      },
      dailyEnabled: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
        allowNull: false
      },
      dailyTime: {
        type: Sequelize.INTEGER,
        defaultValue: 24,
        allowNull: false
      },
      dailyPoints: {
        type: Sequelize.INTEGER,
        defaultValue: 250,
        allowNull: false
      },
      chatEarningEnabled: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
        allowNull: false
      },
      minPoints: {
        type: Sequelize.INTEGER,
        defaultValue: 1,
        allowNull: false
      },
      maxPoints: {
        type: Sequelize.INTEGER,
        defaultValue: 20,
        allowNull: false
      },
      commandPaying: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
        allowNull: false
      },
      tokenPrice: {
        type: Sequelize.INTEGER,
        defaultValue: 100,
        allowNull: false
      }
    };
  }

  get pointsSchema() {
    return {
      id: {
        type: Sequelize.STRING,
        primaryKey: true,
        allowNull: false,
        unique: true
      },
      points: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        defaultValue: 0,
        allowNull: false,
      },
      level: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        defaultValue: 0,
        allowNull: false,
      },
      user: {
        type: Sequelize.STRING,
        primaryKey: true,
        allowNull: false,
      },
      guild: {
        type: Sequelize.STRING,
        primaryKey: true,
        allowNull: false,
      },
      daily: {
        type: Sequelize.STRING,
        primaryKey: true,
        defaultValue: 0,
        allowNull: false,
      }
    };
  }

}

module.exports = Database;