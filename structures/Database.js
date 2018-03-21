const Sequelize = require("sequelize");
const { PGUSER, PGPASS, PGDATA, PGHOST, PGPORT } = process.env;

const database = new Sequelize({
  database: PGDATA,
  username: PGUSER,
  password: PGPASS,
  host: PGHOST,
  port: PGPORT,
  dialect: "postgres",
  logging: false
});

class Database {

  static get db() {
    return database;
  }

  static start() {
    database.authenticate()
      .then(() => console.log("[DATABASE]: Connection has been established successfully."))
      .then(() => database.sync()
        .then(() => console.log("[DATABASE]: Done Synchronizing database!"))
        .catch(error => console.log(`[DATABASE]: Error synchronizing the database: \n${error}`))
      )
      .catch(error => {
        console.log(`[DATABASE]: Unable to connect to the database: \n${error}`);
        console.log("[DATABASE]: Try reconnecting in 5 seconds...");
        setTimeout(() => Database.start(), 5000);
      });
  }
}

module.exports = Database;