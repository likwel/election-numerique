const express = require('express');
const http = require('http');
const app = express();
const port = 5000;
const path = require('path');
var bodyParser = require('body-parser');

let formidable = require('formidable');
let fs = require('fs');

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

    ElecteurModel.findAll({ raw: true }).then(electeurs => {

        // console.log(electeurs);
        VoteModel.findAll({row :true}).then(votes=>{
            res.render('index', {
                electeurs : JSON.stringify(electeurs),
                votes : JSON.stringify(votes)
            });
        })
    })
})

/**
 * Retourner la template electeur.html
 */
app.get('/liste-electorale', (req, res) => {
    res.render("electeur");
})

/**
 * Affichage de la liste des electeurs
 */
app.get('/getAllElector', (req, res) => {

    ElecteurModel.findAll()
        .then(electeurs => {
            // console.log(electeurs);
            res.send(electeurs);

        })

})

/**
 * Sauvegarder un electeur electeur
 */
app.post('/saveOneElector', (req, res) => {

    //Create an instance of the form object
    let form = new formidable.IncomingForm();

    //Process the file upload in Node
    form.parse(req, function (error, fields, file) {
        let photo = file.photo_electeur[0].filepath;
        let photo2 = file.photo2_electeur[0].filepath;

        let rawData = fs.readFileSync(photo)
        let rawData2 = fs.readFileSync(photo2)
        
        let nom = fields.nom_electeur[0]
        let identite = fields.cin_electeur[0]

        let newpath = path.join(__dirname, 'public/labels') + '/' + nom+'-'+identite+'/'

        photo = newpath + 1+path.extname(file.photo_electeur[0].originalFilename);
        photo2 = newpath + 2+path.extname(file.photo2_electeur[0].originalFilename);

        let electeur = {
                identite: identite,
                nom: nom,
                photo: '/labels/'+nom+'-'+identite+'/'+1+path.extname(file.photo_electeur[0].originalFilename),
                photo2: '/labels/'+nom+'-'+identite+'/'+2+path.extname(file.photo2_electeur[0].originalFilename)
            }

        
        if (!fs.existsSync(newpath)){
            fs.mkdirSync(newpath);
        }
 
        fs.writeFile(photo, rawData, function (err) {
            if (err) console.log(err)
            // return res.send("Successfully uploaded")
        })

        fs.writeFile(photo2, rawData2, function (err) {
            if (err) console.log(err)
            // return res.send("Successfully uploaded")
        })

        ElecteurModel.create(electeur);

        res.render("electeur");

    });
    

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

/**
 * Retourner à la liste des candidats
 */
app.get('/getAllCandidat', (req, res) => {

    CandidatModel.findAll().then(result => {
        // console.log(res);
        res.send(result);
    })

})

server.listen(port, () => {
    console.log(`Now listening on port ${port}`);
});