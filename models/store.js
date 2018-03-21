const Sequelize = require("sequelize");
const Database = require("../structures/Database.js");

const store = Database.db.define("store", {});

module.exports = store;