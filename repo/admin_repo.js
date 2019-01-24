const Sequelize = require('sequelize');
let connection = require('../db/dbconnection');

/**
 * to exports the function to search admin using username and password
 */
module.exports = {
    searchAdmin: function (userName, password) {
        return new Promise(function (resolve, reject) {
            connection.getLogIn.sync().then(() => {
                let admin = connection.getLogIn.findAll({
                    where: {
                        userName: userName,
                        password: password
                    }
                });
                resolve(admin);
            });
        });
    }
}