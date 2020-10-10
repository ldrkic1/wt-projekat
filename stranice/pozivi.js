var slikePocetna = [];
var zauzecaPV = [];
var osoblje = [];
var zimskiSemestar = [9,10,11,0];
var ljetniSemestar = [1,2,3,4,5];
var sveRezervacije = [];
var sveSaleBaza = [];
var terminiBaza = [];
var arhivirane = 0;
function sljedece() {
    if(brojacUcitanihSlika == slikePocetna.length && arhivirane == slikePocetna.length) {
        return; //dosli smo do kraja
    }
    else if(arhivirane < brojacUcitanihSlika) { // ukoliko su slike prethodno ucitane
        var naredneTri="";
        trenutni = trenutni +1;
        naredneTri+=ucitaneSlike[trenutni];
        arhivirane+=3;
        document.getElementById("slike").innerHTML = naredneTri;
    }
    else { //ucitavamo nove slike
        var sadrzaj = document.getElementById("slike");
        Pozivi.prikaziPocetnu(sadrzaj);
    }
}
function prethodne() {
    if(arhivirane <= 3 && trenutni == 0) {
        return; //stigli smo do prvih slika
    }
    var prethdneTri = "";
    trenutni = trenutni - 1;
    prethdneTri += ucitaneSlike[trenutni];
    arhivirane -= 3;
    document.getElementById("slike").innerHTML = prethdneTri;
}
var trenutni = -1;
var brojacUcitanihSlika = 0;
var ucitaneSlike =[];
var periodicnaZ = [];
var vanrednaZ = [];

var Pozivi = (function() {
    //Spirala3
    function prikaziPocetnuImpl(sadrzajPocetne) {
        var ajax = new XMLHttpRequest();
        ajax.onreadystatechange = function() {// Anonimna funkcija
            if(ajax.status == 200 && ajax.readyState == 4) {
                var brojac = 0;
                var noviDiv = "";
                slikePocetna = JSON.parse(ajax.responseText);
                while(brojac != 3) {
                    if(brojacUcitanihSlika == slikePocetna.length) { //ucitali smo sve slike
                        break;
                    }
                    else {
                        var novaSlika="<img src=\"" + slikePocetna[brojacUcitanihSlika].url +"\">";
                        noviDiv+=novaSlika;
                        brojacUcitanihSlika++;
                        arhivirane++;
                        brojac++;
                    }
                } 
                ucitaneSlike.push(noviDiv); 
                trenutni++;
                document.getElementById("slike").innerHTML = noviDiv;
            }   
        }
        ajax.open("GET", "pocetnaSlike.json", true);
        ajax.send();
    }
    //Spirala 4 - prepravljen da cita zauzeca iz baze
    function prikaziRezervacijeImpl() {
        popuniSveImpl();
        var ajax = new XMLHttpRequest();
        ajax.onreadystatechange = function() {
        if(ajax.status == 200 && ajax.readyState == 4) {
                terminiBaza = JSON.parse(ajax.responseText);
                for(var i = 0; i < terminiBaza.length; i++) {
                    for(var j = 0; j < sveRezervacije.length; j++) {
                        if(sveRezervacije[j].termin==terminiBaza[i].id) {
                            if(terminiBaza[i].redovni == true) { // periodicna zauzeca
                                var periodicnoZauzece = {
                                    dan: terminiBaza[i].dan,
                                    semestar: terminiBaza[i].semestar,
                                    pocetak: terminiBaza[i].pocetak,
                                    kraj: terminiBaza[i].kraj,
                                    sala: salaNaziv(sveRezervacije[j].sala),
                                    predavac: imePrezimeOsobe(sveRezervacije[j].osoba)
                                };
                                periodicnaZ.push(periodicnoZauzece);
                            }
                            else {
                                var vanrednoZauzece = {
                                    datum: terminiBaza[i].datum,
                                    pocetak: terminiBaza[i].pocetak,
                                    kraj: terminiBaza[i].kraj,
                                    sala: salaNaziv(sveRezervacije[j].sala),
                                    predavac: imePrezimeOsobe(sveRezervacije[j].osoba)
                                };
                                vanrednaZ.push(vanrednoZauzece);
                            }
                        }
                    }
                }
                Kalendar.ucitajPodatke(periodicnaZ, vanrednaZ);   
            }
        }
        ajax.open("GET","termini",true);
        ajax.send();
        /*Spirala 3
        var ajax = new XMLHttpRequest();
        ajax.onreadystatechange = function() {// Anonimna funkcija
            if(ajax.status == 200 && ajax.readyState == 4) {

                zauzecaPV = JSON.parse(ajax.responseText);
                var periodicna = [];
                for ( var i = 0; i < zauzecaPV.periodicna.length; i++) {
                    periodicna.push(zauzecaPV.periodicna[i]);
                }
                Kalendar.ucitajPodatke(zauzecaPV.periodicna, zauzecaPV.vanredna);
            }   
        }
        ajax.open("GET", "zauzeca.json", true);
        ajax.send();*/
    }
    //-------------------------------------------------------------------------------------------------
    // Spirala 4 - zadatak 1
    function popuniOsobljeImpl() {
        spasiSaleIzBazeImpl();
        var ajax = new XMLHttpRequest();
        ajax.onreadystatechange = function() {
            if(ajax.status == 200 && ajax.readyState == 4) {
                var osobljeIzBaze = JSON.parse(ajax.responseText);
                osoblje = osobljeIzBaze;
                var select = document.getElementById("osb");
                select.options.length = 0;
                for(var i = 0; i < osobljeIzBaze.length; i++) {
                    var imePrezime = osobljeIzBaze[i].ime + " " + osobljeIzBaze[i].prezime;
                    var option = document.createElement("option"); // kreiramo option
                    option.text = imePrezime;
                    select.options.add(option,i); //dodajemo option za select
                }
            } 
        }
        ajax.open("GET","osoblje", true);
        ajax.send();
    }
    function spasiSaleIzBazeImpl() {
        var ajax = new XMLHttpRequest();
        ajax.onreadystatechange = function() {
            if(ajax.status == 200 && ajax.readyState == 4) {
                sveSaleBaza = JSON.parse(ajax.responseText);
                // kao opcije dodajem samo one iz baze.. pretpostavljajuci da tako treba..
                var select = document.getElementById("sale");
                select.options.length = 0;
                for(var i = 0; i < 2; i++) {
                    var naziv = sveSaleBaza[i].naziv;
                    var option = document.createElement("option"); // kreiramo option
                    option.text = naziv;
                    select.options.add(option,i); //dodajemo option za select
                }
            }
        }
        ajax.open("GET","sale",true);
        ajax.send();

    }
    // Spirala 4 - zadatak 2
    //sva zazuzeca
    function spasiSveRezervacijeImpl() {
        var ajax = new XMLHttpRequest();
        ajax.onreadystatechange = function() {
            if(ajax.status == 200 && ajax.readyState == 4) {
                sveRezervacije = JSON.parse(ajax.responseText)
                
            }
        }
        ajax.open("GET","rezervacije",true);
        ajax.send();
    }
    function spasiTermineImpl(dan,periodicna,datum,semestar,pocetak,kraj,sala,osoblje,div) {
        var ajax = new XMLHttpRequest();
        ajax.onreadystatechange = function() {
        if(ajax.status == 200 && ajax.readyState == 4) {
                terminiBaza = JSON.parse(ajax.responseText);
                provjeraRezervacijeImpl(dan,periodicna,datum,semestar,pocetak,kraj,sala,osoblje,div);  
            }
        }
        ajax.open("GET","termini",true);
        ajax.send();
    }
    //zbog lakseg dohvatanja svih potrebih podataka
    function popuniSveImpl() {
        popuniOsobljeImpl();
        spasiSveRezervacijeImpl();
        spasiSaleIzBazeImpl();
    }
    function provjeraRezervacijeImpl(dan,periodicna,datum,semestar,pocetak,kraj,sala,osoblje,div) { 
        popuniSveImpl(); 
        var istiTerminPostoji = false;
        var imePrezime = "";
        var salaNaziv, salaZaduzenaOsoba, terminPeriodicni,terminDan,terminDatum, terminSemestar,terminPocet,
        terminKraj, rezervacijaTermin, rezervacijaSala,rezervacijaOsosba;
        var odabranaSalaID = salaID(sveSaleBaza,sala);
        for(var i = 0; i < sveRezervacije.length; i++) {  
            for(var j = 0; j < terminiBaza.length; j++) {
                if(terminiBaza[j].id == sveRezervacije[i].termin) {
                    //ako postoji neko zauzece na isti dan i odabrano vrijeme..pamtimo osobu koja jr zaduzila
                    if((istiDanDatum(periodicna,dan,datum,div) && odabranaSalaID == sveRezervacije[i].sala) && 
                    provjeriDaLiSePreklapajuVremena(pocetak,kraj,terminiBaza[j].pocetak, terminiBaza[j].kraj)) {
                        istiTerminPostoji = true;
                        imePrezime = osobaKojaJeZauzelaTermin(terminiBaza[j].id);           
                    }      
                }
            }
        }
        if(istiTerminPostoji) {
            alert("Nažalost, " + imePrezime + " je već zauzeo termin");
        }	
        else {
            //nema zauzeca u isto vrijeme
            salaNaziv = sala;
            salaZaduzenaOsoba = IDOsobe(osoblje);
            terminPeriodicni = periodicna;
            terminDan = dan;
            terminDatum = datum;
            terminSemestar = semestar;
            terminPocet = pocetak;
            terminKraj = kraj;
            rezervacijaTermin = terminiBaza.length + 1;
            rezervacijaSala = salaID(sveSaleBaza,sala);
            rezervacijaOsosba = IDOsobe(osoblje);
            rezervisiImpl(salaNaziv,salaZaduzenaOsoba,terminPeriodicni,terminDan,terminDatum,terminSemestar,terminPocet,terminKraj,rezervacijaTermin,rezervacijaSala,rezervacijaOsosba);
            if(terminPeriodicni) {
                var periodicnoZauzece = {
                    dan: terminDan,
                    semestar: terminSemestar,
                    pocetak: terminPocet,
                    kraj: terminKraj,
                    sala: salaNaziv,
                    predavac: imePrezimeOsobe(salaZaduzenaOsoba)
                };
                periodicnaZ.push(periodicnoZauzece);
            }
            else {
                var vanrednoZauzece = {
                    datum: terminDatum,
                    pocetak: terminPocet,
                    kraj: terminKraj,
                    sala: salaNaziv,
                    predavac: imePrezimeOsobe(salaZaduzenaOsoba)
                };
                vanrednaZ.push(vanrednoZauzece);
            }
            Kalendar.ucitajPodatke(periodicnaZ,vanrednaZ);
            Kalendar.obojiZauzeca();
        }
    }
    //rezervisemo zauzece 
    function rezervisiImpl(salaNaziv,salaZaduzenaOsoba,terminPeriodicni,terminDan,terminDatum,
        terminSemestar,terminPocet,terminKraj,rezervacijaTermin,rezervacijaSala,rezervacijaOsosba) {   
        var ajax = new XMLHttpRequest();
        ajax.onreadystatechange = function() {
            if(ajax.status == 404) { 
                alert(ajax.responseText);
            }
        }
        ajax.open("POST","rezervisi", true);
        ajax.setRequestHeader("Content-Type", "application/json");
        ajax.send(JSON.stringify({
            periodican: terminPeriodicni,
            dan: terminDan,
            datum: terminDatum,
            semestar: terminSemestar,
            pocetak: terminPocet,
            kraj: terminKraj,
            termin: rezervacijaTermin,
            sala: rezervacijaSala,
            osoba: rezervacijaOsosba,
        }));
    }
    // Spirala 4 - zadatak 3
    function upisiSaleIOsobljeUListuImpl() {
        popuniOsobljeImpl(); // ovo mora ovdje..
        var ajax = new XMLHttpRequest();
        ajax.onreadystatechange = function() {
            if(ajax.status == 200 && ajax.readyState == 4) {
                var divSaTabelom = document.getElementById("tabelaDIV");
                var tabela = "<table>";
                tabela+="<tr><th>Osoblje</th>";
                tabela+="<th>Trenutna sala</th></tr>";
                var osobljeUSalama = JSON.parse(ajax.responseText);
                //popuniOsobljeImpl();
                for(var i = 0; i < osoblje.length; i++) {
                    var id = osoblje[i].id;
                    var ime = osoblje[i].ime;
                    var prezime = osoblje[i].prezime;
                    var trenutnaSala = vratiSaluUKojojJeOsoba(osobljeUSalama,id);
                    tabela+="<tr><td>" + ime + " " + prezime + "</td>";
                    tabela+="<td>" + trenutnaSala + "</td></tr>"
                }
                tabela+="</table>";
                divSaTabelom.innerHTML = tabela;
            }
        }
        ajax.open("GET","saleIOsoblje",true);
        ajax.send();
        setTimeout(() => {
            upisiSaleIOsobljeUListuImpl();
        }, 30000);
    }
    
    return {
        prikaziPocetnu: prikaziPocetnuImpl,
        prikaziRezervacije: prikaziRezervacijeImpl,
        popuniOsoblje: popuniOsobljeImpl,
        upisiSaleIOsobljeUListu: upisiSaleIOsobljeUListuImpl,
        spasiTermine: spasiTermineImpl,
        spasiSveRezervacije: spasiSveRezervacijeImpl,
        spasiSaleIzBaze: spasiSaleIzBazeImpl,
        rezervisi: rezervisiImpl,
        provjeraRezervacije: provjeraRezervacijeImpl,
        popuniSve: popuniSveImpl
    }
}());
//pomocna funkcija zadatak 3 - spirala 4
function vratiSaluUKojojJeOsoba(osobljeUSalama, osobaID) {
    var salaTrenutno = "U kancelariji";
    for(var i = 0; i < osobljeUSalama.length; i++) {
        var id = osobljeUSalama[i].id;
        if(osobaID === id) {
            var sala = osobljeUSalama[i].Sala;
            var rezervacije = osobljeUSalama[i].Rezervacijas;
            for(var j = 0; j < rezervacije.length; j++) {
                var rezervacija = rezervacije[j];
                var termin = rezervacija.Termin;
                var trenutniDatum = new Date();
                if(termin.dan === null) { // vanredna rezervacija 
                    var datum = termin.datum.split(".");
                    var vrijemePocetak = termin.pocetak.split(":");
                    var vrijemeKraj = termin.kraj.split(":");
                    //poredimo trenutni i datum termina
                    if(trenutniDatum.getFullYear() === Number(datum[2]) && trenutniDatum.getMonth() == (Number(datum[1]) - 1) && 
                    trenutniDatum.getDate() === Number(datum[0])) {
                        // isti datum, sada provjeravamo vrijeme
                        var vrijemePocetak = termin.pocetak.split(":");
                        var vrijemeKraj = termin.kraj.split(":");
                        var satiPocetak = Number(vrijemePocetak[0]);
                        var satiKraj = Number(vrijemeKraj[0]);
                        var minutePocetak = Number(vrijemePocetak[1]);
                        var minuteKraj = Number(vrijemeKraj[1]);
                        var trenutniSati = Number(trenutniDatum.getHours());
                        var trenutneMinute = Number(trenutniDatum.getMinutes());

                        if(satiPocetak < trenutniSati && trenutniSati < satiKraj) {
                            salaTrenutno = sala.naziv;
                        }
                        else if(satiPocetak == trenutniSati && trenutniSati < satiKraj) {
                            if(minutePocetak <= trenutneMinute) {
                                salaTrenutno = sala.naziv;
                            }
                        }
                        else if(satiPocetak < trenutniSati && trenutniSati == satiKraj) {
                            if(trenutneMinute <= minuteKraj) {
                                salaTrenutno = sala.naziv;
                            }
                        }
                        else if(satiPocetak == satiKraj) {
                            if(minutePocetak<= trenutneMinute && trenutneMinute <= minuteKraj) {
                                salaTrenutno = sala.naziv;
                            }
                        }
                    }
                }

                if(termin.datum == null && termin.semestar != null && termin.dan != null) { //periodicno zauzece
                    var trenutniDanUSedmici = trenutniDatum.getDay();
                    if(trenutniDanUSedmici == 0) {
                        trenutniDanUSedmici = 6;
                    }
                    else {
                        trenutniDanUSedmici--;
                    }

                    if(trenutniDanUSedmici === termin.dan && ((termin.semestar === "zimski" && 
                    zimskiSemestar.includes(trenutniDatum.getMonth())) || 
                    (termin.semestar === "ljetni" && ljetniSemestar.includes(trenutniDatum.getMonth())))) {
                        // isti dan i semestar, sada provjeravamo vrijeme
                        var vrijemePocetak = termin.pocetak.split(":");
                        var vrijemeKraj = termin.kraj.split(":");
                        var satiPocetak = Number(vrijemePocetak[0]);
                        var satiKraj = Number(vrijemeKraj[0]);
                        var minutePocetak = Number(vrijemePocetak[1]);
                        var minuteKraj = Number(vrijemeKraj[1]);
                        var trenutniSati = Number(trenutniDatum.getHours());
                        var trenutneMinute = Number(trenutniDatum.getMinutes());

                        if(satiPocetak < trenutniSati && trenutniSati < satiKraj) {
                            salaTrenutno = sala.naziv;
                        }
                        else if(satiPocetak == trenutniSati && trenutniSati < satiKraj) {
                            if(minutePocetak <= trenutneMinute) {
                                salaTrenutno = sala.naziv;
                            }
                        }
                        else if(satiPocetak < trenutniSati && trenutniSati == satiKraj) {
                            if(trenutneMinute <= minuteKraj) {
                                salaTrenutno = sala.naziv;
                            }
                        }
                        else if(satiPocetak == satiKraj && satiKraj==trenutniSati) {
                            if(minutePocetak<= trenutneMinute && trenutneMinute <= minuteKraj) {
                                salaTrenutno = sala.naziv;
                            }
                        }
                    }
                }
            }
        }
    }
    return salaTrenutno;
}
function salaID(sale, nazivSale) {
    for(var i = 0; i < sale.length; i++) {
        if(nazivSale == sale[i].naziv) {
            return sale[i].id;
        }
    }
    return -1; // sala nije spasena u bazu...tako da sigurno nije zauzeta
}
function provjeriDaLiSePreklapajuVremena(pocetakForma, krajForma, pocetakBaza, krajBaza) {
    var vrijemePocetakForma = pocetakForma.split(":");
    var vrijemeKrajForma = krajForma.split(":");
    var vrijemePocetakBaza = pocetakBaza.split(":");
    var vrijemeKrajBaza = krajBaza.split(":");
    var satiPocetak = Number(vrijemePocetakForma[0]);
    var satiKraj = Number(vrijemeKrajForma[0]);
    var minutePocetak = Number(vrijemePocetakForma[1]);
    var minuteKraj = Number(vrijemeKrajForma[1]);
    var bazaSatiPocetak = Number(vrijemePocetakBaza[0]);
    var bazaMinutePocetak = Number(vrijemePocetakBaza[1]);
    var bazaSatiKraj = Number(vrijemeKrajBaza[0]);
    var bazaMinuteKraj = Number(vrijemeKrajBaza[1]);
    if(satiPocetak>bazaSatiKraj || satiKraj<bazaSatiPocetak) {
        return false;
    } 
    else if(satiPocetak == bazaSatiKraj) {
        if(minutePocetak >= bazaMinuteKraj) {//pretpostavimo da cim jedne vjezbe/jedno predavanje zavrsi drugo moze poceti
            return false;
        } 
    }
    else if(satiKraj==bazaSatiPocetak) {
        if(minuteKraj <= bazaMinutePocetak) {//pretpostavimo da cim jedne vjezbe/jedno predavanje zavrsi drugo moze poceti
            return false;
        } 
    }
    return true;
}
function imePrezimeOsobe(osobaID) {
    for(var i = 0; i < osoblje.length; i++) {
        if(osoblje[i].id == osobaID) {
            return osoblje[i].ime + " " + osoblje[i].prezime;
        }
    }
}
function IDOsobe(imePrezime) {
    for(var i = 0; i < osoblje.length; i++) {
        if((osoblje[i].ime + " " + osoblje[i].prezime) === imePrezime) {
            return osoblje[i].id;
        }
    }
}
function provjeriPostojiLiTermin(redovni,dan,datum,semes,poc,kraj) {
    for(var i = 0; i < terminiBaza.length; i++) {
        if(terminiBaza[i].redovni == redovni && terminiBaza[i].dan == dan && terminiBaza[i].datum == datum && terminiBaza[i].semestar == semes && terminiBaza[i].pocetak == poc && terminiBaza[i].kraj == kraj) {
            return true;
        }
    }
    return false;  
}
function sljedeciID() {
    return terminiBaza.length + 1;
}
function salaNaziv(id) {
    for(var i = 0; i < sveSaleBaza.length; i++) {
        if(sveSaleBaza[i].id == id) {
            return sveSaleBaza[i].naziv;
        }
    }
}
function istiDanDatum(periodican,dan,datum,div) {
    var danVanr;
    var isti = false;
    if(!periodican) {
        danVanr = Number(div.id) % 7;
    }
    for(var i = 0; i < terminiBaza.length; i++) {
        if(terminiBaza[i].redovni) {
            if(periodican) {
                if(terminiBaza[i].dan == dan) {
                    isti = true;
                }
            }
            else {
                danVanr = (Number(div.id) % 7) - 1;
                if(danVanr == terminiBaza[i].dan) {
                    isti = true;
                }
            }
        }
        //vanredan termin u bazi
        else {
            danVanr = kojiJeDanVanrednoZauzece(terminiBaza[i].datum);
            //redovan sa forme
            if(periodican) {

                if(dan == danVanr) {
                    isti = true;
                }
            }
            else {
                if(datum == terminiBaza[i].datum) {
                    isti = true;
                }
            }
        }
    }
    return isti;
}
function kojiJeDanVanrednoZauzece(datum) {
    var danD = datum.split(".")
    var danDatuma = danD[0]; 
    if(danDatuma.length == 2) {
        if(danDatuma[0] =="0") {
            danDatuma=danDatuma[1];
        }
    }
    var indexdana = 0;
    var kalendar = document.getElementById("kalendar");
    for(var k = 0; k < 6; k++) {
        var sedmica = kalendar.getElementsByClassName("sedmica").item(k);
        var j = k*7;
        var brojac = 7;
        var i_dat = 0;
        while(brojac != 0) {
            var dan = sedmica.getElementsByClassName("dat").item(i_dat);
            if(dan.textContent == danDatuma)  {
                indexdana = i_dat; 
            }
            brojac--;
            i_dat++;
            j++;
        }
    }
    return indexdana;
}
function osobaKojaJeZauzelaTermin(id) {
    var osoba = "";
    for(var i = 0; i < terminiBaza.length; i++) {
        if(terminiBaza[i].id == id) {
            for(var j = 0; j < sveRezervacije.length; j++) {
               if(sveRezervacije[j].termin == terminiBaza[i].id) {
                   osoba = imePrezimeOsobe(sveRezervacije[j].osoba);
               }
            }
        }
    }
    return osoba;
}
