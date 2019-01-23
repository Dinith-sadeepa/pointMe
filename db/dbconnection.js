/**
 * this is the database connection which used sequelize orm
 */

const Sequelize = require('sequelize');

/**
 * to connect with the database
 */
const sequelize = new Sequelize('pointme', 'root', '1234', {
    host: 'localhost',
    dialect: 'mysql',

    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    },

    operatorsAliases: false
});

/**
 * created the table "subscriber"
 */
const Subscriber = sequelize.define('subscriber',{
    maskNo: {
        type:Sequelize.STRING
    },
    mobileNo: {
        type:Sequelize.STRING
    },
    pin: {
        type:Sequelize.STRING
    },
    status: {
        type:Sequelize.STRING
    }
});

// const User = sequelize.define('employee', {
//     firstName: {
//       type: Sequelize.STRING
//     },
//     lastName: {
//       type: Sequelize.STRING
//     }
//   });
  
//   // force: true will drop the table if it already exists
//   User.sync({force: true});

module.exports = {
    getConnection : sequelize,
    getTable : Subscriber
};

/**
 * to check the connection
 */
sequelize
  .authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });