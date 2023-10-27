const express = require('express');
const http = require('http');
const app = express();
const port = 5000;
const path = require('path');
var bodyParser = require('body-parser');

const { Sequelize } = require('sequelize');

const db = require('./connexion');

const CandidatModel = require('./entity/candidat');
const ElecteurModel = require('./entity/electeur');
const VoteModel = require('./entity/vote');
const CandidatList = require('./public/js/candida_list');

app.use(bodyParser.json());
// app.use(express.json())
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
// app.engine('ejs', require('ejs').__express);
app.use(express.static(path.join(__dirname, "public")));
require('dotenv').config();


// Test DB
db.authenticate()
    .then(() => console.log('Database connected...'))
    .catch(err => console.log('Error: ' + err))

const con_param = {
    useNewUrlParser: true,
    useUnifiedTopology: true
}

const server = http.createServer(app);

/**
 * Retourner la tepmate index.html
 */
app.get('/', (req, res) => {
    // res.statusCode = 200;
    // res.setHeader('Content-Type', 'text/html');
    // res.end('Hello World');
    res.render("index");
})

/**
 * Affichage de la liste des electeurs
 */
app.get('/getAllElector', (req, res) => {

    ElecteurModel.findAll()
        .then(electeurs => {
            console.log(electeurs);
            res.send(electeurs);

        })

})

/**
 * Return json d'un candidat par Numero dans la bulletin unique
 */
app.get('/getOneElectorByNumero/:numero', (req, res) => {
    // console.log(req.params.numero);
    CandidatModel.findOne({
        where: {
            numero: req.params.numero,
        }
    })
        .then(electeurs => {
            res.send(electeurs);

        })
})

/**
 * Sauvegarder candidat.json dans la base de données
 */
app.get('/save-candidat/WqaTx0Uj', (req, res) => {

    let candidats = CandidatList.candidat

    for (let candidat of candidats) {
        CandidatModel.create({
            numero: candidat.id,
            parti: candidat.parti,
            nom: candidat.nom,
            logo: candidat.logo,
            photo: candidat.photo
        });
    }
    res.render("index");
})

/**
 * Return template election.html
 */
app.get('/election', (req, res) => {
    res.render("election");
})

/**
 * Faire une election et sauvegarde de la vote dans la base de données
 */
app.post('/election/send', async (req, res) => {

    VoteModel.create({
        electeur_id: req.body.electeur_id,
        candidat_id: req.body.candidat_id,
        vote: true
    })

    res.render("index");
})

/**
 * Retourner à la resultat de l'élection
 */
app.get('/getResultat', (req, res) => {

    VoteModel.findAndCountAll({
        // attributes: ['candidat_id', [Sequelize.fn('count', Sequelize.col('candidat_id')), 'resultat']],
        group: ['candidat_id']
    }).then(result => {
        // console.log(res);
        res.send(result);
    })

    //   res.send({ count, rows });


})

server.listen(port, () => {
    console.log(`Now listening on port ${port}`);
});