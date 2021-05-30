const db = require('./db')

const Fornecedor = db.sequelize.define('Fornecedor', {
    cnpj: {
        type: db.Sequelize.STRING
    },
    nomeFantasia: {
        type: db.Sequelize.STRING
    }
})

//Criar a tabela
Fornecedor.sync({force: true})

module.exports = Fornecedor