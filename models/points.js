const Sequelize = require("sequelize");
const Database = require("../structures/Database.js");

const economy = Database.db.define("economy", {
  id: {
    type: Sequelize.STRING,
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


module.exports = economy;