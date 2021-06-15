const express = require("express");
const app = express();
const port = 8080;

const handlebars = require("express-handlebars");
const bodyParser = require("body-parser")

const Orcamento = require("./models/Orcamento")
const ItensOrcamento = require("./models/ItensOrcamento")
const Produto = require("./models/Produto")
const Fornecedor = require("./models/Fornecedor");
const nodemailer = require('nodemailer')
const { Sequelize } = require("./models/db");


app.engine('handlebars', handlebars({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')



app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())


async function SendEmail(Sendfrom,link) {
    console.log("Enviando email para: "+Sendfrom)
    var transport = nodemailer.createTransport({
        service: "Gmail",
        auth: {
            user: "email@email.com",
            pass: "senha"
        }
    });

    let message = await transport.sendMail({
        from: Sendfrom,
        to: Sendfrom,
        subject: "Chegou um novo orçamento para você!",
        html: "Olá caro fornecedor, <br>Estamos enviando uma solicitação para preenchimento de cotação de produtos. <br><p>Link para responder o orçamento: "+link+"<p>",
        
    })
}

//Rotas
app.get('/', function (req, res) {
    res.render('index');
});


app.get('/Orcamentos', function (req, res) {
    Orcamento.findAll().then(function (orcamentos) {
        res.render('ViewOrcamentos', { orcamentos: orcamentos });
    });

});

app.get('/Fornecedores', function (req, res) {
    Fornecedor.findAll().then(function (fornecedores) {
        res.render('ViewFornecedores', { fornecedores: fornecedores });
    });

});

app.get('/Produtos', function (req, res) {
    Produto.findAll().then(function (produtos) {
        res.render('ViewProdutos', { produtos: produtos });
    });
});


//Requisita Orcamentos
app.get('/OrcamentoFornecedor', function (req, res) {
    res.render('PreenchimentoOrcamentos');
});


//Requisita Orcamentos
app.get('/cad-Orcamento', async function (req, res) {

    const prod = await Produto.findAll({ raw: true });
    const forn = await Fornecedor.findAll();

    res.render('CadastroOrcamentos', { dados: { prod, forn } });
});

app.get('/cad-Produto', function (req, res) {
    res.render('CadastroProdutos');
});

app.get('/cad-Fornecedor', function (req, res) {
    res.render('CadastroFornecedores');
});

app.get('/dashboard', function (req, res) {
    res.render('ViewDashboard');
});


app.post('/alt-Produto',async function (req, res) {
    console.log(req.body.EditarFamilia);
    await Produto.update({ descricao: req.body.EditarDescricao,idFamilia: req.body.EditarFamilia}, {
        where: {
          id: req.body.EditarID
        }
      });
      
      await Produto.findAll().then(function (produtos) {
        res.render('ViewProdutos', { produtos: produtos });
    });
});


app.post('/alt-Fornecedor',async function (req, res) {
    console.log(req.body.EditarFamilia);
    await Fornecedor.update({ 
        razaoSocial: req.body.ModaRazaoSocial,
        nomeFantasia: req.body.ModaNomeFantasia,
        cnpj: req.body.ModaCnpj,
        telContato: req.body.ModaTelContato,
        email: req.body.ModaEmail,
        endereco: req.body.ModaEndereco,
        cidade: req.body.ModaCidade,
        atividades: req.body.ModaAtividades 
    }, {
        where: {
          id: req.body.ModalID
        }
      });
      
      await Fornecedor.findAll().then(function (fornecedores) {
        res.render('ViewFornecedores', { fornecedores: fornecedores });
    });
});

app.get('/resp-Orcamento', async function (req, res) {
    var db = require('./models/db');

    const { Op } = require("sequelize");

    let itensOrc, orc, forn;
    if (req.query.f != null && req.query.o != null) {
        await db.sequelize.query("SELECT a.id, a.idFornecedor, a.idOrcamento, b.id as idProduto, b.descricao, a.qtdProduto, a.qtdProduto FROM sqldevmind.itensorcamentos as a inner join sqldevmind.produtos as b on a.idProduto = b.id where a.idFornecedor = :fornecedor and a.idOrcamento= :orcamento",
            {
                replacements: {
                    orcamento: req.query.o, fornecedor: req.query.f
                },
                type: Op.SELECT
            }).then(function (res) {
                itensOrc = res[0]
            }).then(async function () {
                const Orc = await Orcamento.findAll({
                    where: {
                        [Op.and]: [
                            { idFornecedor: req.query.f },
                            { id: parseInt(req.query.o) }
                        ]
                    },
                    raw: true
                });
                orc = Orc[0];
            }).then(async function () {
                const Forn = await Fornecedor.findAll({
                    where: {
                        [Op.and]: [
                            { id: req.query.f }
                        ]
                    },
                    raw: true
                });
                forn = Forn[0];
            }).then(function () {
                console.log(orc);
                if (orc != undefined)
                    res.render('RespOrcamento', { title: 'Resposta Orçamento', layout: false, dados: { orc, itensOrc, forn } });
                else
                    res.render('ErrorOrcamento', { title: 'Error', layout: false })
            });
    }else{
        res.render('ErrorOrcamento', { title: 'Error', layout: false })
    }
});
/*
app.use(function (req, res, next) {
    res.render('Error', { title: 'Erro', layout: false })
})*/

function DataAtual() {
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();

    today = dd + '/' + mm + '/' + yyyy;
    return today;
}

app.post('/resp-Orcamento', async function (req, res) {
        if(1 == req.body.ItemID.length){
            for (i = 0; i < req.body.ItemID.length; i++) {
                console.log(req.body);
                console.log("Com variavel "+req.body.ItemValorUni);
                await ItensOrcamento.update({ precoProduto: req.body.ItemValorUni }, {
                    where: {
                        id: req.body.ItemID,
                        idOrcamento: req.body.OrcamentoID,
                        idFornecedor: req.body.FornecedorID
                    }
                }).then(async function () {
                    await Orcamento.update({ statusOrcamento: "Respondido", dataResposta: DataAtual() }, {
                        where: {
                            id: req.body.OrcamentoID,
                            idFornecedor: req.body.FornecedorID
                        }
        
                        //res.send("Orcamento cadastro com sucesso!")
                    })
                }).catch(function (erro) {
                    res.send("Erro: Orcamento não foi cadastrado com sucesso!" + erro)
                })
            }
        
        }
        else{
            for (i = 0; i < req.body.ItemID.length; i++) {
                console.log(req.body);
                console.log("Com variavel "+req.body.ItemValorUni[i]);
                await ItensOrcamento.update({ precoProduto: req.body.ItemValorUni[i],valorIpi:req.body.ItemIpi[i]  }, {
                    where: {
                        id: req.body.ItemID[i],
                        idOrcamento: req.body.OrcamentoID,
                        idFornecedor: req.body.FornecedorID
                    }
                }).then(async function () {
                    await Orcamento.update({ statusOrcamento: "Respondido", dataResposta: DataAtual(), frete: req.body.Frete}, {
                        where: {
                            id: req.body.OrcamentoID,
                            idFornecedor: req.body.FornecedorID
                        }
        
                        //res.send("Orcamento cadastro com sucesso!")
                    })
                }).catch(function (erro) {
                    res.send("Erro: Orcamento não foi cadastrado com sucesso!" + erro)
                })
            }
        
        }
   

    res.redirect('/');
});

//Envia para cadastro orcamento
app.post('/cad-Orcamento', async function (req, res) {
    console.log(req.body);

     await Orcamento.findAll({
        attributes: [[Sequelize.fn('max', Sequelize.col('id')), 'maxID']],
        raw: true,
    }).then(async function (retorno) {
        let idOrcamento = retorno[0].maxID + 1;
        for (var i = 0; i < req.body.DescricaoForn.length; i++) {
            console.log("Teste!!!!!" + " Length: " + req.body.DescricaoForn.length)
            await Orcamento.create({
                id:idOrcamento,
                idFornecedor: req.body.DescricaoForn[i],
                idUsuarioSolicitante: req.body.IDSolicitante,
                descricao: req.body.Descricao,
                dataSolicitacao: DataAtual(),
                dataLimite: req.body.DataLimite,
                dataResposta: req.body.DataRespota,
                statusOrcamento: 'aberto',

            }).then(function (res) {
                console.log("Orçamento Numero: " + res.dataValues.id)
                for (a = 0; a < req.body.ItemProduto.length; a++) {
                    ItensOrcamento.create({
                        idOrcamento: res.dataValues.id,
                        idFornecedor: req.body.DescricaoForn[i],
                        idProduto: req.body.ItemProduto[a],
                        qtdProduto: req.body.ItemQuantidade[a],
                    }
                    ).catch(function (erro) {
                       // res.send("Erro: Orcamento não foi cadastrado com sucesso!" + erro)
                    })
                }
            }).then(async function(){
                const { Op } = require("sequelize");
            
                 const Forn = await Fornecedor.findAll({
                    where: {
                        [Op.and]: [
                            { id:  req.body.DescricaoForn[i] }
                        ]
                    },
                    raw: true
                });
                forn = Forn[0];
                SendEmail(forn.email,"http://localhost:8080/resp-Orcamento?o="+idOrcamento+"&f="+ req.body.DescricaoForn[i]);
            })
        }
    })


    res.redirect('/cad-Orcamento');
});

//Envia para cadastro Produto
app.post('/cad-Produto', function (req, res) {
    Produto.create({
        descricao: req.body.Descricao,
        idFamilia: req.body.Familia,

    }).then(function () {
        res.redirect('/cad-Produto')
        //res.send("Orcamento cadastro com sucesso!")
    }).catch(function (erro) {
        res.send("Erro: Orcamento não foi cadastrado com sucesso!" + erro)
    })
    //res.send("Nome: " + req.body.nome + "<br>Valor: " + req.body.valor + "<br>") 
})


//Envia para cadastro Fornecedor
app.post('/cad-Fornecedor', function (req, res) {
    Fornecedor.create({
        cnpj: req.body.Cnpj,
        nomeFantasia: req.body.NomeFantasia,
        razaoSocial: req.body.RazaoSocial,
        telContato: req.body.TelContato,
        endereco: req.body.Endereco,
        cidade: req.body.Cidade,
        atividades: req.body.Atividades,

    }).then(function () {
        res.redirect('/cad-Fornecedor')
        //res.send("Orcamento cadastro com sucesso!")
    }).catch(function (erro) {
        res.send("Erro: Orcamento não foi cadastrado com sucesso!" + erro)
    })
    //res.send("Nome: " + req.body.nome + "<br>Valor: " + req.body.valor + "<br>") 
})



app.listen(port);

console.log("Serviço executado, disponivel em ", port);