const db = require('./db')

const Fornecedor = db.sequelize.define('Fornecedor', {
    id: {
        type: db.Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    razaoSocial: {
        type: db.Sequelize.STRING
    },
    nomeFantasia: {
        type: db.Sequelize.STRING
    },
    cnpj: {
        type: db.Sequelize.STRING
    },
    telContato: {
        type: db.Sequelize.STRING
    },
    endereco: {
        type: db.Sequelize.STRING
    },
    cidade: {
        type: db.Sequelize.STRING
    },
    atividades: {
        type: db.Sequelize.STRING
    },
    
})

//Criar a tabela
//Fornecedor.sync({force: true})

module.exports = Fornecedor