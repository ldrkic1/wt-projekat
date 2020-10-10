const Sequelize = require('sequelize');
//kreiramo bazu
const sequelize = new Sequelize("DBWT19","root","root",{host:"127.0.0.1",dialect:"mysql",logging:false});

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;
//import modula
db.osoblje = sequelize.import(__dirname + "/osoblje.js");
db.rezervacija = sequelize.import(__dirname + "/rezervacija.js");
db.termin = sequelize.import(__dirname + "/termin.js");
db.sala = sequelize.import(__dirname + "/sala.js");

//definisemo relacije

//Osoblje - jedan na više - Rezervacija -- jedna osoba moze imati vise rezervacija
db.osoblje.hasMany(db.rezervacija, {foreignKey:"osoba"});

//Rezervacija - jedan na jedan - Termin -- jednom terminu odgovara samo jedna rezervaciju
db.rezervacija.belongsTo(db.termin,{foreignKey:"termin"});

//Rezervacija - više na jedan - Sala -- jedna sala moze imati vise rezervacija
db.sala.hasMany(db.rezervacija,{foreignKey:"sala"});

//Sala - jedan na jedan - Osoblje
db.sala.belongsTo(db.osoblje, {foreignKey:"zaduzenaOsoba"} );

//nisu pravilo tj. potpuno povezane bez oovogaaa -- potrebno zbog povezivanja vise tabela u upitima
db.osoblje.hasOne(db.sala, {constraints: false, foreignKey:"zaduzenaOsoba"});
db.sala.hasOne(db.rezervacija, {constraints: false, foreignKey:"sala"});
db.termin.hasOne(db.rezervacija, {constraints:false, foreignKey:"termin"});
db.osoblje.hasOne(db.rezervacija, {constraints: false, foreignKey:"osoba"});

module.exports = db;