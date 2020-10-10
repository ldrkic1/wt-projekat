var trenutni = new Date().getMonth();
function load(kalendarRef,mjesec) {
    Kalendar.iscrtajKalendar(kalendarRef,mjesec);
}
function prethodni(kalendar) {
    var sala = document.getElementById("sale").options[document.getElementById("sale").selectedIndex].text;
    var pocetak = document.getElementById("pocetak").value + ":00";
    var kraj = document.getElementById("kraj").value + ":00";
    var mjesec = dajMjesec(document.getElementById('mjesec').textContent);
    if(trenutni > 0) {
        trenutni--;  
        Kalendar.iscrtajKalendar(kalendar,trenutni);   
        Kalendar.obojiZauzeca(kalendar,trenutni,sala,pocetak,kraj); 
    }
    else {
        return;
    }
      
}
function sljedeci(kalendar) {
    var mjesec = dajMjesec(document.getElementById('mjesec').textContent);
    var sala = document.getElementById("sale").options[document.getElementById("sale").selectedIndex].text;
    var pocetak = document.getElementById("pocetak").value + ":00";
    var kraj = document.getElementById("kraj").value + ":00";
    if(trenutni < 11) {
        trenutni++;    
        Kalendar.iscrtajKalendar(kalendar,trenutni);  
        Kalendar.obojiZauzeca(kalendar,trenutni,sala,pocetak,kraj);
        
    }
    else {
        return;
    }      
}

var periodicnaZauzeca = [];
var vanrednaZauzeca = [];
var trenutnoZauzetaPeriodicna = [];
var trenuntnoZauzetaVanredna = [];
let Kalendar = (function(){
    function obojiZauzecaImpl (kalendarRef, mjesec, sala, pocetak, kraj) {
        ukloniZauzeca();
        var kalendar = document.getElementById("kalendar"); 
        var salaR = document.getElementById("sale");
        var s = salaR.options[document.getElementById("sale").selectedIndex].text;  
        var pocRezervaacije = document.getElementById("pocetak").value + ":00";
        var krajRezervacije = document.getElementById("kraj").value + ":00";
        var m = dajMjesec(document.getElementById("mjesec").textContent);
        //alert(vanrednaZauzeca.length);
        if(typeof s != "" && typeof pocRezervaacije != "" && typeof krajRezervacije != "") {
            for(var i = 0; i < periodicnaZauzeca.length; i++) {  
                if(((((trenutni>=9 && trenutni<=11)  || trenutni==0) && periodicnaZauzeca[i].semestar=="zimski") || (((trenutni>=1 && trenutni<=5) && periodicnaZauzeca[i].semestar=="ljetni"))) && periodicnaZauzeca[i].sala == s && provjeriDaLiSePreklapajuVremena(pocRezervaacije,krajRezervacije,periodicnaZauzeca[i].pocetak,periodicnaZauzeca[i].kraj)) {  
                    for(var k = 0; k < 6; k++) {    
                        var sedmica = kalendar.getElementsByClassName("sedmica").item(k);
                        var j = k*7;
                        var brojac = 7;
                        var i_dat = 0;
                        while(brojac != 0) {
                            var dan = sedmica.getElementsByClassName("dat").item(i_dat);
                            if(j % 7 == periodicnaZauzeca[i].dan) {
                                //alert("nasao sam dan");
                                if(dan.classList.contains("slobodna")) {
                                    dan.classList.remove("slobodna");
                                }
                                dan.classList.add("zauzeta");
                                trenutnoZauzetaPeriodicna.push(periodicnaZauzeca[i]);
                            }
                            brojac--;
                            i_dat++;
                            j++;
                        }
                    }
                }
            }
            for(var i = 0; i < vanrednaZauzeca.length; i++) {
                var datum = vanrednaZauzeca[i].datum.split(".");
                var mjesecVanr = Number(datum[1]-1);
                var danVanr = Number(datum[0]);
               
                if(mjesecVanr ==  trenutni && vanrednaZauzeca[i].sala == s && provjeriDaLiSePreklapajuVremena(pocRezervaacije,krajRezervacije,vanrednaZauzeca[i].pocetak,vanrednaZauzeca[i].kraj)) {
                    //alert(danVanr);
                    for(var k = 0; k < 6; k++) {
                        var sedmica = kalendar.getElementsByClassName("sedmica").item(k);
                        var j = k*7;
                        var brojac = 7;
                        var i_dat = 0;
                        while(brojac != 0) {
                            var dan = sedmica.getElementsByClassName("dat").item(i_dat);
                            if(dan.textContent != null && !dan.classList.contains('invisible')) {
                                //alert(dan.textContent);
                                if(danVanr==dan.textContent) {  
                                    //alert(dan.textContent);
                                //if((dan.textContent + "." + Number(trenutni+1) + "." + (new Date()).getFullYear()) == vanrednaZauzeca[i].datum) {
                                    dan.classList.add("zauzeta");
                                    trenuntnoZauzetaVanredna.push(vanrednaZauzeca[i]);     
                                }
                                
                            }
                            brojac--;
                            i_dat++;
                            j++;
                        }
                    }
                }
            }
        }   
    }
    function ucitajPodatkeImpl(periodicna, vanredna) {
        periodicnaZauzeca = periodicna;
        vanrednaZauzeca = vanredna;
        trenutni = (new Date()).getMonth();
    }
    function iscrtajKalendarImpl(kalendarRef, mjesec) {
        nazivMjeseca(trenutni);
        iscrtajDane();
        popuniKalendar(kalendarRef,trenutni);
    }
    return {
    obojiZauzeca: obojiZauzecaImpl,
    ucitajPodatke: ucitajPodatkeImpl,
    iscrtajKalendar: iscrtajKalendarImpl
    }
    }());
function iscrtajDane() {
    var dani = ['PON', 'UTO', 'SRI', 'ČET', 'PET', 'SUB', 'NED'];
    var divDani = document.getElementById("dani");
    for(var i = 0; i <7; i++) {
        divDani.getElementsByClassName("dan").item(i).innerHTML = dani[i];
    }
}
function popuniKalendar(kalendar,mjesec) {
    var dani = ['1','2','3','4','5','6','7','8','9','10','11','12','13','14','15','16','17','18','19','20','21','22','23','24','25','26','27','28','29','30','31'];
    if(mjesec == 0) {
        dani.unshift('','');
        dani.push('','');
    }
    else if(mjesec == 1) {
        dani.pop();
        dani.pop();
        dani.pop();
        dani.unshift('','','','','');
        dani.push('','');
    }
    else if(mjesec == 2) {
        dani.unshift('','','','','','');
        dani.push('','','','','');
    }
    else if(mjesec == 3) {
        dani.pop();
        dani.unshift('','');
        dani.push('','','','','','','','','','');
    }
    else if(mjesec == 4) {
        dani.unshift('','','','');
        dani.push('','','','','','','');
    }
    else if(mjesec == 5) {
        dani.pop();
        dani.push('','','','','','','','','','','','');
    }
    else if(mjesec == 6) {
        dani.unshift('','');
        dani.push('','','','','','','','','');
    }
    else if(mjesec == 7) {
        dani.unshift('','','','','');
        dani.push('','','','','','');
    }
    else if(mjesec == 8) {
        dani.pop();
        dani.push('','','','','','','','','','','');
        dani.unshift('');

    }
    else if(mjesec == 9) {
        dani.unshift('','','');
        dani.push('','','','','','','','','');
    }
    else if(mjesec == 10) {
        dani.pop();
        dani.unshift('','','','','','');
        dani.push('','','','','','');
    }
    else {
        dani.push('','','','','','','','','','');
        dani.unshift('');
    }
    
    for(var i = 0; i < 42; i++) {
        var izmjeni = document.getElementsByClassName("dat").item(i);
        izmjeni.classList.remove('invisible');
        if(trenutni>=6 && trenutni <=8)  {
            izmjeni.classList.remove('zauzeta');
        }
    }
    vecZauzeta();
    for(var i = 0; i < 6; i++) {
        var izmjeni = document.getElementsByClassName("sedmica").item(i);
        izmjeni.className = 'sedmica';
    }
    for(var i = 0; i < 6; i++) {
        var sedmica = kalendar.getElementsByClassName("sedmica").item(i);
        if(i == 5 && mjesec !=2  && mjesec!= 7 && mjesec!=10) {
            sedmica.classList.add("sesta");
            break;
        }
        var j = i*7;
        var brojac = 7;
        var i_dat = 0;
        while(brojac != 0) {
            var dan = sedmica.getElementsByClassName("dat").item(i_dat);
            dan.innerHTML = dani[j];
            if(dani[j] == '') {
                dan.classList.add("invisible");
            }
            brojac--;
            i_dat++;
            j++;
        }
    }
}

function nazivMjeseca(mjesec) { 
    var label = document.getElementById("mjesec");
    if(mjesec == 0) {
        label.innerHTML = 'Januar';
    }
    else if(mjesec == 1) {
        label.innerHTML = 'Februar';
    }
    else if(mjesec == 2) {
        label.innerHTML = 'Mart';
    }
    else if(mjesec == 3) {
        label.innerHTML = 'April';
    }
    else if(mjesec == 4) {
        label.innerHTML = 'Maj';
    }
    else if(mjesec == 5) {
        label.innerHTML = 'Juni';
    }
    else if(mjesec == 6) {
        label.innerHTML = 'Juli';
    }
    else if(mjesec == 7) {
        label.innerHTML = 'August';
    }
    else if(mjesec == 8) {
        label.innerHTML = 'Septembar';
    }
    else if(mjesec == 9) {
        label.innerHTML = 'Oktobar';
    }
    else if(mjesec == 10) {
        label.innerHTML = 'Novembar';
    }
    else {
        label.innerHTML = 'Decembar'; 
    }
}
function dajMjesec(mjesec) {
    if(mjesec == 'Januar') {
        return 0;
    }
    else if(mjesec == 'Februar') {
        return 1;
    }
    else if(mjesec == 'Mart') {
        return 2;
    }
    else if(mjesec == 'April') {
        return 3;
    }
    else if(mjesec == 'Maj') {
        return 4;
    }
    else if(mjesec == 'Juni') {
        return 5;
    }
    else if(mjesec == 'Juli') {
        return 6;
    }
    else if(mjesec == 'August') {
        return 7;
    }
    else if(mjesec == 'Septembar') {
        return 8;
    }
    else if(mjesec == 'Oktobar') {
        return 9;
    }
    else if(mjesec == 'Novembar') {
        return 10;
    }
    else {
        return 11;
    }
}

function vecZauzeta() {
    //var mjesec = dajMjesec(document.getElementById('mjesec').textContent);
    for(var i = 0; i < trenutnoZauzetaPeriodicna.length; i++) {   
        var mjesec = dajMjesec(document.getElementById('mjesec').textContent);
        if(((((trenutni>=9 && trenutni<=11)  || trenutni==0) && trenutnoZauzetaPeriodicna[i].semestar=="zimski") || (((mjesec>=1 && mjesec<=5) && trenutnoZauzetaPeriodicna[i].semestar=="ljetni")))) {
            for(var k = 0; k < 6; k++) {
                var kalendar = document.getElementById('kalendar');
                var sedmica = kalendar.getElementsByClassName("sedmica").item(k);
                var j = k*7;
                var brojac = 7;
                var i_dat = 0;
                while(brojac != 0) {
                    var dan = sedmica.getElementsByClassName("dat").item(i_dat);
                    if( j % 7 == trenutnoZauzetaPeriodicna[i].dan) {
                        dan.classList.add("zauzeta");
                    }
                    brojac--;
                    i_dat++;
                    j++;
                }
            }
        }
    }
}
function ukloniZauzeca() {
    /*var mjesec = dajMjesec(document.getElementById('mjesec').textContent);
    for(var i = 0; i < trenutnoZauzetaPeriodicna.length; i++) {   
        var mjesec = dajMjesec(document.getElementById('mjesec').textContent);
        if(((((mjesec>=9 && mjesec<=11)  || mjesec==0) && trenutnoZauzetaPeriodicna[i].semestar=="zimski") || (((mjesec>=1 && mjesec<=5) && trenutnoZauzetaPeriodicna[i].semestar=="ljetni")))) {
           */ for(var k = 0; k < 6; k++) {
                var kalendar = document.getElementById('kalendar');
                var sedmica = kalendar.getElementsByClassName("sedmica").item(k);
                var j = k*7;
                var brojac = 7;
                var i_dat = 0;
                while(brojac != 0) {
                    var dan = sedmica.getElementsByClassName("dat").item(i_dat);
                    if( dan.classList.contains("zauzeta")) {
                        dan.classList.remove("zauzeta");
                        dan.classList.add("slobodna");
                    }
                    brojac--;
                    i_dat++;
                    j++;
                }
            
        
    }
}
function provjeriDaLiSePreklapajuVremena(pocetakForma, krajForma, pocetakNiz, krajNiz) {
    var vrijemePocetakForma = pocetakForma.split(":");
    var vrijemeKrajForma = krajForma.split(":");
    var vrijemePocetakNiz = pocetakNiz.split(":");
    var vrijemeKrajNiz = krajNiz.split(":");
    var satiPocetak = Number(vrijemePocetakForma[0]);
    var satiKraj = Number(vrijemeKrajForma[0]);
    var minutePocetak = Number(vrijemePocetakForma[1]);
    var minuteKraj = Number(vrijemeKrajForma[1]);
    var nizSatiPocetak = Number(vrijemePocetakNiz[0]);
    var nizMinutePocetak = Number(vrijemePocetakNiz[1]);
    var nizSatiKraj = Number(vrijemeKrajNiz[0]);
    var nizMinuteKraj = Number(vrijemeKrajNiz[1]);
    if(satiPocetak>nizSatiKraj || satiKraj<nizSatiPocetak) {
        return false;
    } 
    else if(satiPocetak == nizSatiKraj) {
        if(minutePocetak >= nizMinuteKraj) {//pretpostavimo da cim jedne vjezbe/jedno predavanje zavrsi drugo moze poceti
            return false;
        } 
    }
    else if(satiKraj==nizSatiPocetak) {
        if(minuteKraj <= nizMinutePocetak) {//pretpostavimo da cim jedne vjezbe/jedno predavanje zavrsi drugo moze poceti
            return false;
        } 
    }
    return true;
}