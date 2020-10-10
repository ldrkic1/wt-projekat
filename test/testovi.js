const Sequelize = require('sequelize');
var request = require("request");
var express = require("express");
var app = require("../index.js");
var db = require("../db.js");
var base_url = "http://localhost:8080";
var assert = require("assert");
var chai = require('chai');
global.expect = chai.expect;
describe("Osoblje", function () {
    describe("GET/osoblje", function () {
        it("Trebalo bi da vrati 3 osobe", function (done) {
            this.timeout(10000);
            request.get(base_url+"/osoblje", function (error, response, body) {
               // var niz = 
                assert.equal(3,(JSON.parse(response.body)).length);
            }).finally(done());
        });
    });
    describe("GET/osoblje", function () {
        it("Trebalo bi da prvi bude Nekic", function (done) {
            this.timeout(10000);
            request.get(base_url+"/osoblje", function (error, response, body) {
                var niz = JSON.parse(response.body);
                assert.equal("Nekić",niz[0].prezime);
               
            }).finally(done());
        });
    });
    describe("GET/osoblje", function () {
        it("Trebalo bi da zadnji bude Test Test", function (done) {
            this.timeout(10000);
            request.get(base_url+"/osoblje", function (error, response, body) {
                var niz = JSON.parse(response.body);
                assert.equal("Test Test",niz[2].ime + " " + niz[2].prezime);
            }).finally(done());
        });
    });
});
describe("Sale", function () {
    describe("GET/sale", function () {
        it("Trebalo bi da vrati 2 sale", function (done) {
            this.timeout(10000);
            request.get(base_url+"/sale", function (error, response, body) {
                var niz = (JSON.parse(response.body));
                assert.equal(2,niz.length);
            }).finally(done());
        });
    });
    describe("GET/sale", function () {
        it("Trebalo bi da prva sala bude 1-11", function (done) {
            this.timeout(10000);
            request.get(base_url+"/sale", function (error, response, body) {
                var niz = JSON.parse(response.body);
                assert.equal("1-11",niz[0].naziv);
              
            }).finally(done());
        });
    });
    describe("GET/osoblje", function () {
        it("Trebalo bi da druga sala bude 1-15", function (done) {
            this.timeout(10000);
            request.get(base_url+"/sale", function (error, response, body) {
                var niz = JSON.parse(response.body);
                assert.equal("1-15",niz[1].naziv);
            }).finally(done());
        });
    });
});

describe("zauzeca", function () {
    describe("GET/saleIOsoblje", function () {
        it("Trebalo bi da vrati 1 zauzece", function (done) {
            this.timeout(10000);
            request.get(base_url+"/saleIOsoblje", function (error, response, body) {
                var niz = (JSON.parse(response.body));
                assert.equal(1,niz.length);
            }).finally(done());
        });
    });
    /*describe("Dodajemo novo zauzece", function () {
        it("Trebalo bi da vrati 2 zauzece", function (done) {
            this.timeout(30000);
            db.termin.create({redovni:0,dan:4,datum:null,semestar:"zimski",pocetak:"09:00",kraj:"10:00"}).then(
                function(termin) {
                    db.rezervacija.create({termin:termin.id,sala:1,osoba:2}).then(function(rezervacija) {
                        request.get(base_url+"/saleIOsoblje", function (error, response, body) {
                            var niz = (JSON.parse(response.body));
                            assert.equal(2,niz.length);
                        }).finally(done());
                    });
                }
            );
            
        });
    });*/
});