const express = require("express");
const app = express();
const handlebars = require("express-handlebars");
const bodyParser = require("body-parser")
const Orcamento = require("./models/Orcamento")
const ItensOrcamento = require("./models/ItensOrcamento")
const Produto = require("./models/Produto")
const Fornecedor = require("./models/Fornecedor")


app.engine('handlebars', handlebars({defaultLayout: 'main'}))
app.set('view engine', 'handlebars')

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

//Rotas
app.get('/', function(req, res){
    
    Orcamento.findAll().then(function(){
    res.render('index');
    });

});


app.get('/Orcamentos', function(req, res){
    Orcamento.findAll().then(function(orcamentos){
    res.render('ViewOrcamentos',{orcamentos: orcamentos});
    });

});

app.get('/Fornecedores', function(req, res){
    Fornecedor.findAll().then(function(orcamentos){
    res.render('ViewFornecedores',{orcamentos: orcamentos});
    });

});

app.get('/Produtos', function(req, res){
    Produto.findAll().then(function(produtos){
    res.render('ViewProdutos',{produtos: produtos});
    });
});


//Requisita Orcamentos
app.get('/OrcamentoFornecedor', function(req, res){
    res.render('PreenchimentoOrcamentos');
});


//Requisita Orcamentos
app.get('/cad-Orcamento', function(req, res){
    res.render('CadastroOrcamentos');
});

app.get('/cad-Produto', function(req, res){
    res.render('CadastroProdutos');
});

app.get('/cad-Fornecedor', function(req, res){
    res.render('CadastroFornecedores');
});

app.get('/dashboard', function(req, res){
    res.render('ViewDashboard');
});

//Envia para cadastro orcamento
app.post('/resp-cad-orcamento', function(req, res){
    Orcamento.create({
        idFornecedor: req.body.IDFornecedor,
        idUsuarioSolicitante: req.body.IDSolicitante,
        descricao: req.body.Descricao,
        dataSolicitacao: req.body.DataSolicitacao,
        dataLimite: req.body.DataLimite,
        dataResposta: req.body.DataRespota,
        statusOrcamento: 'aberto',
    }).then(function(){
        res.redirect('/Orcamento')
        //res.send("Orcamento cadastro com sucesso!")
    }).catch(function(erro){
        res.send("Erro: Orcamento não foi cadastrado com sucesso!" + erro)
    })
    //res.send("Nome: " + req.body.nome + "<br>Valor: " + req.body.valor + "<br>") 
})

//Envia para cadastro Produto
app.post('/cad-Produto', function(req, res){
    Produto.create({
        descricao: req.body.Descricao,
        idFamilia: req.body.Familia,
    
    }).then(function(){
        res.redirect('/Produtos')
        //res.send("Orcamento cadastro com sucesso!")
    }).catch(function(erro){
        res.send("Erro: Orcamento não foi cadastrado com sucesso!" + erro)
    })
    //res.send("Nome: " + req.body.nome + "<br>Valor: " + req.body.valor + "<br>") 
})


//Envia para cadastro Fornecedor
app.post('/cad-Fornecedor', function(req, res){
    Fornecedor.create({
        cnpj: req.body.Cnpj,
        nomeFantasia: req.body.NomeFantasia,
    
    }).then(function(){
        res.redirect('/Fornecedores')
        //res.send("Orcamento cadastro com sucesso!")
    }).catch(function(erro){
        res.send("Erro: Orcamento não foi cadastrado com sucesso!" + erro)
    })
    //res.send("Nome: " + req.body.nome + "<br>Valor: " + req.body.valor + "<br>") 
})



app.listen(8080);