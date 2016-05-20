"use strict";
/* jshint esnext:true, -W110 */

var Sequelize, sequelize, DataTypes, Promise = require('bluebird'), _ = require('lodash'), moment = require('moment');

Sequelize = DataTypes = require('./index.js');
//var db = sequelize = new Sequelize('sequelize', 'root', '', {
var db = sequelize = new Sequelize('sequelize', 'postgres', 'postgres', {
  dialect: 'postgres',
//var db = sequelize = new Sequelize('sequelize-test-72', 'sequelize', 'nEGkLma26gXVHFUAHJxcmsrK', {
//  dialect: 'mssql',
//  host: 'mssql.sequelizejs.com',
//  port: 11433,
//  dialect: 'sqlite',
  define: {
    timestamps: false,
  },
  //logging: console.log
});

var User = sequelize.define('user');
var Task = sequelize.define('task', {
  timestamp: Sequelize.DATE
});

User.hasMany(Task);

return sequelize.sync({
  force: true,
  logging: console.log
})
  .then(user => {
    return User.findAll({
      include: [{
        model: Task
      }],
      order: [sequelize.literal('(SELECT timestamp FROM tasks WHERE "userId" = "user"."id") DESC')]
    });
  })
  .finally(() => sequelize.close());
