const db = require('./db')

const Itens = db.sequelize.define('itensOrcamento', {
    idOrcamento: {
        type: db.Sequelize.STRING,
    },
    idFornecedor: {
        type: db.Sequelize.STRING
    },
    idProduto: {
        type: db.Sequelize.STRING
    },
    qtdProduto: {
        type: db.Sequelize.STRING
    },
    precoProduto: {
        type: db.Sequelize.STRING
    },
    valorIpi: {
        type: db.Sequelize.STRING
    }
})

//Criar a tabela
//Itens.sync({force: true})

//Alter a tabela
//Itens.sync({alter: true})

module.exports = Itens