const db = require('./db')

const Orcamento = db.sequelize.define('orcamento', {
    id: {
        type: db.Sequelize.INTEGER,
        primaryKey: true
    },
    idFornecedor: {
        primaryKey: true,
        type: db.Sequelize.INTEGER
    },
    idUsuarioSolicitante: {
        type: db.Sequelize.STRING
    },
    descricao: {
        type: db.Sequelize.STRING
    },
    statusOrcamento: {
        type: db.Sequelize.STRING
    },
    dataSolicitacao: {
        type: db.Sequelize.STRING
    },
    dataLimite: {
        type: db.Sequelize.STRING
    },
    dataResposta: {
        type: db.Sequelize.STRING
    }
})

//Criar a tabela
//Orcamento.sync({force: true})

module.exports = Orcamento