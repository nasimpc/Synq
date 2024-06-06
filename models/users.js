const Sequelize = require('sequelize');
const sequelize = require('../util/database')

const User = sequelize.define('User', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    name: {
        type: Sequelize.STRING,
        allowNull: false
    },
    deviceId: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    availableCoins: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    phoneNumber: {
        type: Sequelize.BIGINT(10),
        unique: true,
        allowNull: false
    },
    password: {
        type: Sequelize.TEXT,
        allowNull: false
    },
    isPremiumUser: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
    }
})
module.exports = User;