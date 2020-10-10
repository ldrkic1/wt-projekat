const Sequelize = require('sequelize');
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const fs = require('fs');
const http = require('http');
const app = express();
const db = require('./db.js')

const Rezervacija = db.sequelize.import(__dirname + "/rezervacija.js");
const Osoblje = db.sequelize.import(__dirname + "/osoblje.js");
const Sala = db.sequelize.import(__dirname + "/sala.js");
const Termin = db.sequelize.import(__dirname + "/termin.js");
db.sequelize.sync({force:true}).then(function(){
    inicializacija().then(function(){
        console.log("Gotovo kreiranje tabela i ubacivanje pocetnih podataka!");
        process.exit();
    });
});

app.use(express.static(path.join(__dirname + "/stranice/")));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true}));

app.get('/pocetnaSlike.json', function(req, res) {
    var json = path.join(__dirname,'/stranice/pocetnaSlike.json');
    res.sendFile(json);
});

app.get('/pocetna.html', function(req, res) {
    fs.readFile('pocetnaSlike.json', 'utf8', (error, data) => {
        if(error) {
            throw error;
        }
        var slike = JSON.parse(data);
        res.setHeader('Content-Type', 'application/json');
        res.sendFile(slike);    
    });
});
app.get('/unos.html', function(req, res) {
    var unos = path.join(__dirname,'/stranice/unos.html');
    res.sendFile(unos);
});
app.get('/zauzeca.json', function(req, res) {
    var json = path.join(__dirname,'/stranice/zauzeca.json');
    res.sendFile(json);
});
// Spirala 4 - zadatak 1
app.get('/osoblje',function(req,res) {
    Osoblje.findAll().then(function(osoblje) {
        res.send(osoblje);
    })
});
//dohvatanje sala
app.get('/sale', function(req,res) {
    Sala.findAll().then(function(sale) {
        res.send(sale);
    })
});
//termini
app.get('/termini', function(req,res) {
    Termin.findAll().then(function(termini) {
        res.send(termini);
    })
});
//dohvatanje rezervacija
app.get('/rezervacije', function(req, res) {
    Rezervacija.findAll().then(function(rezervacije) {
        res.send(rezervacije);
    })
});
//Spirala 4 - zadatak 2 - upis u bazuu
app.post('/rezervisi', function(req,res) {
    var redovan = req.body.periodican;
    var danF = req.body.dan;
    var datumF = req.body.datum;
    var semestarF = req.body.semestar;
    var pocetakF = req.body.pocetak;
    var krajF = req.body.kraj;
    var salaF = req.body.sala;
    var osobaF = req.body.osoba;
    Termin.findAll().then(function(redovi) {
        db.termin.create({redovni:redovan,dan: danF, datum: datumF, semestar: semestarF, pocetak: pocetakF, kraj: krajF}).then(function(termin) {
            db.rezervacija.create({termin: termin.id, sala: salaF, osoba: osobaF});
        });   
    });  
    res.end();
})
// Spiral 4 - zadatak 3 - lista osoblja i sala
app.get("/saleIOsoblje", function(req,res) {
    Osoblje.findAll({
        // povezujemo tabele..
        //ovako dobivamo nesto kao 
        //select * 
        //from Sala s,Rezervacija r ,Termin t, Osoblje o
        //where s.id=r.sala and r.termin=t.id and o.id=r.osoba
        include: [{
                model:Sala,
                required: true
            }, {
            model: Rezervacija,
            required: true,
            include: [
                {
                    model: Termin,
                    required: true
                }
            ]
        }]
    }).then(function(osobeKojeSuZauzeleSaleUTerminu) {
        res.send(osobeKojeSuZauzeleSaleUTerminu);
    })

});
app.get('/rezervacija.html', function(req, res) {
    fs.readFile('zauzeca.json', 'utf8', (error, data) => {
        if(error) {
            throw error;
        }
        var zauzeca = JSON.parse(data);
        res.setHeader('Content-Type', 'application/json');
        res.send(zauzeca);    
    });
});
app.get('/sale.html', function(req, res) {
    var sale = path.join(__dirname,'/stranice/sale.html');
    res.sendFile(sale);
});
app.get('/osobe.html', function(req, res) {
    var sale = path.join(__dirname,'/stranice/osobe.html');
    res.sendFile(sale);
});
app.post('/rezervacija', function(req,res) {
    fs.readFile('zauzeca.json','utf8', (err, data) => {
        if(err) {
            throw err;
        }
        var zauzeca = JSON.parse(data);
        res.setHeader('Content-Type', 'application/json');
        res.send(zauzeca);   
    });
});
app.listen(8080);

function inicializacija() {
    return new Promise(function(resolve,reject) {
        db.osoblje.create({id:1,ime:"Neko",prezime:"Nekić",uloga:"profesor"}).then(function(osoba1) {
            db.osoblje.create({id:2,ime:"Drugi",prezime:"Neko",uloga:"asistent"}).then(function(osoba2) {
                db.osoblje.create({id:3,ime:"Test",prezime:"Test",uloga:"asistent"}).then(function(osoba3) {
                    db.termin.create({id:1,redovni:false,dan:null,datum:"01.01.2020",semestar:null,pocetak:"12:00",kraj:"13:00"}).then(function(termin1) {
                        db.termin.create({id:2,redovni:true,dan:0,datum:null,semestar:"zimski",pocetak:"13:00",kraj:"14:00"}).then(function(termin2) {
                            db.sala.create({id:1,naziv:"1-11",zaduzenaOsoba:1}).then(function(sala1) {
                                db.sala.create({id:2,naziv:"1-15",zaduzenaOsoba:2}).then(function(sala2){
                                    db.rezervacija.create({id:1,termin:termin1.id,sala:sala1.id,osoba:osoba1.id});
                                    db.rezervacija.create({id:2,termin:termin2.id,sala:sala1.id,osoba:osoba3.id});
                                });
                            });
                        });
                    });
                });
            });
        });
        
        //provjera treceg zadatka
        //db.osoblje.create({id:4,ime:"Proba", prezime:"Proba", uloga:"asistent"});
        //db.termin.create({id:3,redovni:false,dan:null,datum:"20.01.2020",semestar:null,pocetak:"17:00",kraj:"20:00"});
        //db.sala.create({id:3,naziv:"1-10",zaduzenaOsoba:4});
        //db.rezervacija.create({id:3,termin:3,sala:3,osoba:4});
    });
}

module.exports = app;