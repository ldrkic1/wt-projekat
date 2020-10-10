const Sequelize = require("sequelize");

module.exports = function(sequelize, DataTypes) {
    const Termin = sequelize.define("Termin", {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        redovni: Sequelize.BOOLEAN,
        dan: Sequelize.INTEGER,
        datum: Sequelize.STRING,
        semestar: Sequelize.STRING, //pretpostavka da je greska sto u postavci pise tip INTEGER jer u primjeru pise "zimski"
        pocetak: Sequelize.TIME,
        kraj: Sequelize.TIME
    }, 
    {
        timestamps: false,
        freezeTableName: true
    })
    return Termin;
};