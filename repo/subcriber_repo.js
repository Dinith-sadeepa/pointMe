/**
 * this is dao layer and used with sequelize package.
 */

const sequelize = require('sequelize');
let connection = require('../db/dbconnection');

/**
 * these methods were exported because this class is used in controller package.
 * so the controller should be able to use this crud methods.
 */

module.exports = {
    addSubscriber: function (maskNo, pin) {
        // var msg = "maskno=123123&sddsdf&message=reg pm";
        connection.getTable.sync().then(() => {
            return connection.getTable.create({
                maskNo: maskNo,
                mobileNo: maskNo,
                pin: pin,
                status: 'pending'
            });
        })
    },

    updateSubscriber: function (maskNo, mobileNo, pin) {
        connection.getTable.findAll({
            raw: true,
            where: {
                maskNo: maskNo
            }
        }).then(function (result) {
            if (result[0].pin === pin) {
                connection.getTable.update({
                    mobileNo: mobileNo,
                    status: 'varified'
                }, {
                        where: {
                            maskNo: maskNo
                        }
                    });
            }
        });
    },
    
    getAllSubscribers: function () {
        return new Promise(function (resolve, reject) {
            resolve(connection.getConnection.query('select count(id) as count from subscribers', { model: connection.getTable }));
        });

    }
};

