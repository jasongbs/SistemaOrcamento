const db = require('./db')

const Produto = db.sequelize.define('Produto', {
    id:{
    type: db.Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true
    },
    descricao: {
        type: db.Sequelize.STRING
    },
    idFamilia: {
        type: db.Sequelize.STRING
    }
})

//Criar a tabela
//Produto.sync({force: true})

//Alterar a tabela
//Produto.sync({alter: true})
module.exports = Produto