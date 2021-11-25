require('dotenv').config();   // Added this line so that the variables defined in .env could be accessed and allow the database to connect using the DATABASE_URL env variable
const Sequelize = require("sequelize");

const db = new Sequelize(process.env.DATABASE_URL || "postgres://localhost:5432/messenger", {
  logging: false
});

module.exports = db;
