const Sequelize = require("sequelize");
const Database = require("../structures/Database.js");

const reminders = Database.db.define("reminders", {});

module.exports = reminders;