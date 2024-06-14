const Sequelize = require('sequelize');
const sequelize = require('../util/database');

const Group = sequelize.define('Groups', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    name: {
        type: Sequelize.STRING(50),
        unique: true,
        notEmpty: true,
    },
    date: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
    },
    count: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
    }
},
    {
        timestamps: false
    });

module.exports = Group;
