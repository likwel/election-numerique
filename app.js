const express = require('express');
const http = require('http');
const app = express();
const port = 5000;
const path = require('path');
var bodyParser = require('body-parser');
var PDFExtract = require('pdf.js-extract').PDFExtract;

let formidable = require('formidable');
let fs = require('fs');

const { Sequelize, QueryTypes } = require('sequelize');
const sequelize = require('sequelize');

const db = require('./connexion');

const cookieParser = require('cookie-parser')
const userRoutes = require ('./Routes/userRouter')
const dashboardRoutes = require ('./Routes/dashboardRouter')

const CandidatModel = require('./models/candidat');
const FokontanyModel = require('./models/fokontany');
const DistrictModel = require('./models/district');
const RegionModel = require('./models/region');
const ProvinceModel = require('./models/province');
const CommuneModel = require('./models/commune');
const ElecteurModel = require('./models/electeur');
const VoteModel = require('./models/vote');


const CandidatList = require('./public/js/candida_list');
const CommuneList = require('./public/static/new_commune.json');
const FokontanyList = require('./public/static/new_fokontany.json');
const DistrictList = require('./public/static/new_district.json');
const RegionList = require('./public/static/new_region.json');
const ProvinceList = require('./public/static/new_province.json');
const Electeur = require('./models/electeur');

app.use(bodyParser.json({limit: '50mb'}));
// app.use(express.json())
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(cookieParser())
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

app.get("/scan/pdf", (req, res)=>{

    let homepath = path.join(__dirname, 'public/assets').replace(new RegExp('\\' + path.sep, 'g'), '/');

    var pdfExtract = new PDFExtract();

    let op ={
            firstPage : 1, // default:`1` - start extract at page nr
            lastPage : 2, //  stop extract at page nr, no default value
            password : '', //  for decrypting password-protected PDFs., no default value
            verbosity : -1, // default:`-1` - log level of pdf.js
            normalizeWhitespace : true, // default:`false` - replaces all occurrences of whitespace with standard spaces (0x20).
            disableCombineTextItems : true // default:`false` - do not attempt to combine  same line {@link TextItem}'s.
    }

    
    var pdfFilePath = homepath + '\\'+'Recapitulation_par_Commune.pdf';

    pdfExtract.extract(pdfFilePath , op, function (err, data) {
        if (err) return console.log(err);
        let all_data_array = data.pages
        

        for(let data of all_data_array){
            // console.log(data.content);

            for(let i=0; i<data.content.length; i++){

                let result = {}

                let page = data.content[i]
                console.log(page);

                if(page.x.toString().includes('55')){
                    //result["fokontany"] = page.str
                    console.log("Fokontany : "+page.str);
                }else{
                    if(page.x.toString().includes("128")){
                        console.log("Data : "+page.str);
                    }
                    if(page.str.toString().includes("58")){
                        console.log("District: "+page.str);
                    }
                    if(page.str.toString().includes("557")) {
                        console.log("Commune: "+page.str);
                    }
                    //console.log("Data : "+page.str);
                }

                //console.log(result);
                

                // if(open.x == 55.7000000000001){
                //     res['fokontany'] = open.str
                // }else{
                //     res['data'] = open.str
                // }
            }
            
            
        }
        //console.log(res);
        
    });

    
})

/**
 * Retourner la tepmate index.html
 */
app.get('/', (req, res) => {

    // const cookie = req.headers.cookie;
    const cookie = req.cookies;

    console.log(cookie);

    let token = cookie.token

    if(!req.cookies.user){
        res.redirect('/login')
    }

    // console.log(token);
    
    let query = 'SELECT electeurs.id as id, electeurs.nom as nom, electeurs.identite as identite, '
        + 'electeurs.photo as photo, electeurs.photo2 as photo2, fokontanies.nom as fokontany, communes.nom as commune, districts.nom as district,'
        + 'regions.nom as region, provinces.nom as province FROM electeurs '
        + 'INNER JOIN fokontanies ON electeurs.id_fokontany = fokontanies.id '
        + 'INNER JOIN communes ON fokontanies.id_commune = communes.id INNER JOIN districts ON communes.id_district = districts.id '
        + 'INNER JOIN regions ON districts.id_region = regions.id INNER JOIN provinces ON regions.id_province = provinces.id '

    const records = db.query(query, {
        type: QueryTypes.SELECT
    }).then(electeurs => {

        res.render('index', {
            electeurs: JSON.stringify(electeurs)
        });
    })

    // ElecteurModel.findAll({ raw: true }).then(electeurs => {

    //     res.render('index', {
    //         electeurs: JSON.stringify(electeurs)
    //     });
    // })
})

/**
 * Retourner la template electeur.html
 */
app.get('/liste-electorale', (req, res) => {
    res.render("electeur");
})

/**
 * Retourner la template electeur.html
 */
app.get('/bureau-de-vote', (req, res) => {
    res.render("bureauVote");
})

/**
 * Retourner la template bureau de vote.html
 */
app.get('/getAllbureau-de-vote', (req, res) => {

    let query = 'SELECT fokontanies.id as id_fokontany, fokontanies.nom as fokontany, communes.nom as commune, districts.nom as district,'
        + 'regions.nom as region, provinces.nom as province FROM fokontanies '
        + 'INNER JOIN communes ON fokontanies.id_commune = communes.id INNER JOIN districts ON communes.id_district = districts.id '
        + 'INNER JOIN regions ON districts.id_region = regions.id INNER JOIN provinces ON regions.id_province = provinces.id '

    const records = db.query(query, {
        type: QueryTypes.SELECT
    }).then(data => {
        res.send(data);
    });

})

/**
 * Retourner la template bureau de vote.html
 */
app.get('/getBureau-de-vote/:id', (req, res) => {

    let query = 'SELECT fokontanies.id as id_fokontany, fokontanies.nom as fokontany, communes.nom as commune, districts.nom as district,'
        + 'regions.nom as region, provinces.nom as province FROM fokontanies '
        + 'INNER JOIN communes ON fokontanies.id_commune = communes.id INNER JOIN districts ON communes.id_district = districts.id '
        + 'INNER JOIN regions ON districts.id_region = regions.id INNER JOIN provinces ON regions.id_province = provinces.id WHERE fokontanies.id =' + req.params.id
    const records = db.query(query, {
        type: QueryTypes.SELECT
    }).then(data => {
        res.send(data);
    });

})

/**
 * Affichage de la liste des electeurs
 */
app.get('/getAllElector', (req, res) => {

    let query = 'SELECT electeurs.id as id, electeurs.nom as nom, electeurs.identite as identite, '
        + 'electeurs.id_fokontany as id_fokontany, communes.id as id_commune, districts.id as id_district,regions.id as id_region,provinces.id as id_province, '
        + 'electeurs.photo as photo, electeurs.photo2 as photo2, fokontanies.nom as fokontany, communes.nom as commune, districts.nom as district,'
        + 'regions.nom as region, provinces.nom as province FROM electeurs '
        + 'INNER JOIN fokontanies ON electeurs.id_fokontany = fokontanies.id '
        + 'INNER JOIN communes ON fokontanies.id_commune = communes.id INNER JOIN districts ON communes.id_district = districts.id '
        + 'INNER JOIN regions ON districts.id_region = regions.id INNER JOIN provinces ON regions.id_province = provinces.id '

    const records = db.query(query, {
        type: QueryTypes.SELECT
    }).then(electeurs => {

        res.send(electeurs);

        // res.render('index', {
        //     electeurs: JSON.stringify(electeurs)
        // });
    })

    // ElecteurModel.findAll()
    //     .then(electeurs => {
    //         // console.log(electeurs);
    //         res.send(electeurs);

    //     })

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

        let type = fields.type_election[0]
        let id = fields.id_electeur[0]

        let id_fokontany = fields.fokontany_electeur[0]

        let newpath = path.join(__dirname, 'public/labels') + '/' + nom + '-' + identite + '/'

        photo = newpath + 1 + path.extname(file.photo_electeur[0].originalFilename);
        photo2 = newpath + 2 + path.extname(file.photo2_electeur[0].originalFilename);

        let electeur = {
            identite: identite,
            nom: nom,
            id_fokontany: id_fokontany,
            photo: '/labels/' + nom + '-' + identite + '/' + 1 + path.extname(file.photo_electeur[0].originalFilename),
            photo2: '/labels/' + nom + '-' + identite + '/' + 2 + path.extname(file.photo2_electeur[0].originalFilename)
        }

        let electeur_update = {
            identite: identite,
            nom: nom,
            id_fokontany: id_fokontany
        }


        if (!fs.existsSync(newpath)) {
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

        if (type == "create") {

            ElecteurModel.create(electeur);

        } else {

            ElecteurModel.update(electeur_update, {
                where: {
                    id: id
                }
            });

        }


        res.redirect('/liste-electorale')

    });


})

/**
 * Change photo electeur
 */
app.post('/change-photo/:number', (req, res) => {
    let id = req.body.id;
    let file = req.body.file;
    let nom = req.body.nom;
    let identite = req.body.identite;

    let base64 = file.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
    var buffer = new Buffer.from(base64[2], 'base64');

    let newpath = path.join(__dirname, 'public/labels') + '/' + nom + '-' + identite + '/'

    let extension = file.split(';')[0].split('/')[1]

    let photo = newpath + req.params.number + "."+extension;

    let photo_name = '/labels/' + nom + '-' + identite + '/' + req.params.number + "."+extension

    fs.writeFile(photo, buffer, 'base64', function (err) {
        // console.log(err);
    });

    if(req.params.number==1){
        ElecteurModel.update({
            photo : photo_name
        }, {
            where: {
                id: id
            }
        });
    }
    if(req.params.number==2){
        ElecteurModel.update({
            photo2 : photo_name
        }, {
            where: {
                id: id
            }
        });
    }

    res.redirect('/liste-electorale')

});

/**
 * Return json d'un candidat par Numero dans la bulletin unique
 */
app.get('/getOneCandidatByNumero/:numero', (req, res) => {
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
 * Return json d'un candidat par Numero dans la bulletin unique
 */
app.get('/getOneCandidatById/:id', (req, res) => {
    // console.log(req.params.numero);
    CandidatModel.findOne({
        where: {
            numero: req.params.id,
        }
    })
        .then(candidat => {
            res.send(candidat);

        })
})

/**
 * Return json d'un electeur par id dans la bulletin unique
 */
app.get('/getOneElecteurById/:id', (req, res) => {
    // console.log(req.params.numero);
    ElecteurModel.findOne({
        where: {
            id: req.params.id,
        }
    }).then(electeurs => {
        res.send(electeurs);
    })
})

/**
 * Return json d'un voteur(electeur) par id dans la bulletin unique
 */
app.get('/getOneVoteById/:id', (req, res) => {
    // console.log(req.params.numero);
    VoteModel.findOne({
        where: {
            electeur_id: req.params.id,
        }
    }).then(electeurs => {
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

    res.redirect('/')
    // res.render("index");
})

/**
 * Sauvegarder fokontany.json dans la base de données
 */
app.get('/save-fokontany/WJtXTx0Uj', (req, res) => {

    let fokontany = FokontanyList

    for (let foko of fokontany) {
        FokontanyModel.create({
            code: foko.code,
            nom: foko.nom,
            id_commune: foko.id_commune
        });
    }

    res.redirect('/')
    // res.render("index");
})

/**
 * Sauvegarder commune.json dans la base de données
 */
app.get('/save-commune/WJtrTx0Uj', (req, res) => {

    let comumes = CommuneList

    for (let commune of comumes) {
        CommuneModel.create({
            code: commune.code,
            id_district: commune.id_district,
            nom: commune.nom
        });
    }

    res.redirect('/')
    // res.render("index");
})

/**
 * Sauvegarder district.json dans la base de données
 */
app.get('/save-district/WotrTx0Uj', (req, res) => {

    let districts = DistrictList

    for (let district of districts) {
        DistrictModel.create({
            code: district.code,
            id_region: district.id_region,
            nom: district.nom
        });
    }

    res.redirect('/')
    // res.render("index");
})

/**
 * Sauvegarder region.json dans la base de données
 */
app.get('/save-region/W0IhrTx0Uj', (req, res) => {

    let regions = RegionList

    for (let district of regions) {
        RegionModel.create({
            code: district.code,
            id_province: district.id_province,
            nom: district.nom
        });
    }

    res.redirect('/')
    // res.render("index");
})

/**
 * Sauvegarder region.json dans la base de données
 */
app.get('/save-province/WplDrTx0Uj', (req, res) => {

    let provinces = ProvinceList

    for (let district of provinces) {
        ProvinceModel.create({
            code: district.code,
            nom: district.nom
        });
    }

    res.redirect('/')
    // res.render("index");
})

/**
 * Return template election.html
 */
app.get('/election', (req, res) => {

    let id = req.query.id

    if (id) {

        VoteModel.findOne({
            where: {
                electeur_id: id,
            }
        }).then(electeur => {
            if (electeur) {
                // res.send("Efa avy nifidy ianao tompoko")
                res.render("election", {
                    message: "exist"
                });
            } else {
                res.render("election", {
                    message: "notexist"
                });
            }
        })

    } else {

        res.redirect('/')

    }
})

app.get('/destroy-electeur/:id', (req, res) => {
    Electeur.destroy({
        where: {
            id: req.params.id
        },
        // truncate: true,
        // restartIdentity: true
    });
    res.redirect('/liste-electorale')
})

app.get('/update-electeur', (req, res) => {

    Electeur.update({
        identite: req.body.identite,
        nom: req.body.nom,
        photo: req.body.photo,
        photo2: req.body.photo2
    }, {
        where: {
            id: req.params.id
        }
    });

    res.redirect('/liste-electorale')
})

/**
 * Return template election.html
 */
app.get('/resultat-election', (req, res) => {

    VoteModel.findAndCountAll({
        attributes: ['candidat_id', [Sequelize.fn('count', Sequelize.col('candidat_id')), 'resultat']],
        group: ['candidat_id']
    }).then(result => {
        // res.send(result.rows)
        res.render("resultatVote", {
            resultat: JSON.stringify(result.rows)
        });
    })
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

    res.render("election", {
        message: "notexist"
    });

})

/**
 * Retourner à la resultat de l'élection
 */
app.get('/getResultat', (req, res) => {

    VoteModel.findAndCountAll({
        order: [
            ['candidat_id', 'ASC'],
        ],
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

    CandidatModel.findAll({
        order: [
            ['id', 'ASC'],
        ],
    }).then(result => {
        // console.log(res);
        res.send(result);
    })

})

/**
 * Retourner à la liste des candidats
 */
app.get('/getAllProvince', (req, res) => {

    ProvinceModel.findAll().then(result => {
        // console.log(res);
        res.send(result);
    })

})

/**
 * Retourner à la liste des candidats
 */
app.get('/getAllRegion/:id_province', (req, res) => {

    RegionModel.findAll({
        where: {
            id_province: req.params.id_province
        }
    }).then(result => {
        // console.log(res);
        res.send(result);
    })

})

/**
 * Retourner à la liste des district
 */
app.get('/getAllDistrict/:id_region', (req, res) => {

    DistrictModel.findAll({
        where: {
            id_region: req.params.id_region
        }
    }).then(result => {
        // console.log(res);
        res.send(result);
    })

})

/**
 * Retourner à la liste des commune
 */
app.get('/getAllCommune/:id_dist', (req, res) => {

    CommuneModel.findAll({
        where: {
            id_district: req.params.id_dist
        }
    }).then(result => {
        // console.log(res);
        res.send(result);
    })

})

/**
 * Retourner à la liste des commune
 */
app.get('/getAllFokontany/:id_commune', (req, res) => {

    FokontanyModel.findAll({
        where: {
            id_commune: req.params.id_commune
        }
    }).then(result => {
        // console.log(res);
        res.send(result);
    })

})


//routes for the user API
app.use('/', userRoutes)

//routes for the dashboard API
app.use('/dashboard', dashboardRoutes)

server.listen(port, () => {
    console.log(`Maintenant à l'écoute sur le port ${port}`);
});