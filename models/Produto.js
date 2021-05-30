const db = require('./db')

const Produto = db.sequelize.define('Produto', {
    descricao: {
        type: db.Sequelize.STRING
    },
    idFamilia: {
        type: db.Sequelize.STRING
    }
})

//Criar a tabela
//Produto.sync({force: true})

module.exports = Produto