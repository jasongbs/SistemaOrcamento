const db = require('./db')

const Itens = db.sequelize.define('itensOrcamento', {
    idOrcamento: {
        type: db.Sequelize.STRING,
        references:{model:'Orcamento',key:'id'},
        onUpdate:'CASCADE',
        onDelete:'CASCADE',
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
    }
})

//Criar a tabela
//Itens.sync({force: true})

module.exports = Itens