const Sequelize = require("sequelize");
module.exports = function(sequelize,DataTypes) {
    const Sala = sequelize.define("Sala", {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        naziv: Sequelize.STRING,
        /*zaduzenaOsoba: {
            type: Sequelize.INTEGER,
            foreignKey: true
        }*/
        
    },
    {
        timestamps: false,
        freezeTableName: true
    })
    
    return Sala;
};