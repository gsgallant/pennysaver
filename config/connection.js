// *********************************************************************************
// CONNECTION.JS - THIS FILE INITIATES THE CONNECTION TO MYSQL
// *********************************************************************************
//greg pw = Thew1zardof0z
// Dependencies
var Sequelize = require("sequelize");

// Lists out connection options
var source = {

    localhost: {
        port: 3306,
        host: 'localhost',
        user: 'root',
        password: "mf4711MF",
        database: "food_db"
    },
//after we deploy to heroku and add the jawsDB then we can add the missing data here:
    jawsDB: {
        port: 3306,
        host     : 'g8r9w9tmspbwmsyo.cbetxkdyhwsb.us-east-1.rds.amazonaws.com',
        user     : 'rpxjl8n8jkvtccs4',  
        password : 'ctz16b9cbuxplia0',
        database : 'r24jx5oemvxfcfaa'
    }
}

// Selects a connection (can be changed quickly as needed)
var selectedSource = source.localhost;

// Creates mySQL connection using Sequelize
var sequelize = new Sequelize(selectedSource.database, selectedSource.user, selectedSource.password, {
  host: selectedSource.host,
  dialect: 'mysql',

  pool: {
    max: 5,
    min: 0,
    idle: 10000
  },

});

// Exports the connection for other files to use
module.exports = sequelize;