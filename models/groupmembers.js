const Sequelize = require('sequelize');
const sequelize = require('../util/database');

const Groupmember = sequelize.define('GroupMembers', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    status: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
    }

},
    {
        timestamps: false
    });

module.exports = Groupmember;