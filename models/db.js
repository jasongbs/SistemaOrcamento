const Sequelize = require("sequelize")

const sequelize = new Sequelize('sqldevmind', 'admin', 'admin',{
    host: 'localhost',
    dialect: 'mysql'
})

module.exports = {
    Sequelize: Sequelize,
    sequelize: sequelize
}