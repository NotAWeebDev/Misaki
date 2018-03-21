const Sequelize = require("sequelize");
const Database = require("../structures/Database.js");

const inventory = Database.db.define("inventory", {});

module.exports = inventory;