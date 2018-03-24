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

  get inventory() {
    return this.db.define("inventory", {});
  }

  get reminders() {
    return this.db.define("reminders", {});
  }

  get store() {
    return this.db.define("store", {});
  }

  get settings() {
    return this.db.define("settings", {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
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
      levelNotice: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
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
      socialInventory: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
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
      tokenPrice: {
        type: Sequelize.INTEGER,
        defaultValue: 100,
        allowNull: false
      }
    });
  }

  get points() {
    return this.db.define("economy", {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false,
        unique: true
      },
      points: {
        type: Sequelize.NUMBER,
        primaryKey: true,
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
        allowNull: false,
      }
    });
  }

}

module.exports = Database;