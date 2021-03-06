const Sequelize = require("sequelize");
const config = require("../../server/.config.js");

const configs = config.configs;

const developmentConfig = configs.development.database;
const productionConfig = configs.production.database;
const testConfig = configs.test.database;

module.exports = {
  "development": {
    "username": developmentConfig.username,
    "password": developmentConfig.password,
    "host": developmentConfig.host,
	"port": developmentConfig.port,
    "database": "note-dev",
    "dialect": "mysql",
	"operatorsAliases":Sequelize.Op,
  },
  "test": {
    "username": testConfig.username,
    "password": testConfig.password,
    "host": testConfig.host,
	"port": testConfig.port,
    "database": "note-test",
    "dialect": "mysql",
	"operatorsAliases":Sequelize.Op,
  },
  "production": {
    "username": productionConfig.username,
    "password": productionConfig.password,
    "host": productionConfig.host,
	"port": productionConfig.port || 3306,
    "database": "note",
    "dialect": "mysql",
	"operatorsAliases":Sequelize.Op,
  }
};

console.log(developmentConfig);
