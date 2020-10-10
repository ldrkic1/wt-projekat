Pozivi.prikaziRezervacije();
Pozivi.popuniOsoblje();
Pozivi.spasiSveRezervacije();
function klik(div) {
    var pocetak = document.getElementById('pocetak').value + ":00";
    var kraj = document.getElementById('kraj').value + ":00";
    var sala = document.getElementById("sale").options[document.getElementById("sale").selectedIndex].text;
    var periodicna = document.getElementById('periodicna');
    var mjesec = dajMjesec(document.getElementById('mjesec').textContent);
    var osoblje = document.getElementById("osb").options[document.getElementById("osb").selectedIndex].text;
    var datum="";
    if(pocetak != '' && kraj != '' && sala != '') {
        var potvrdjeno = confirm("Da li želite rezervisati ovaj termin?");
        var semestar = "";
        if((mjesec>=9 && mjesec<=11) || mjesec == 0) {
            semestar = "zimski";
        }
        if(mjesec>=1 && mjesec<=5) {
            semestar = "ljetni";
        }
        if(potvrdjeno == true) {
            if(periodicna.checked) {
                datum = null;
                var dan = Number(div.id) % 7;
                if(dan == 0) {
                    dan = 6;
                }
                else {
                    dan = dan - 1;
                }  
            }
            else {
                semestar = null;
                dan = null;
                var danMj = div.textContent;
                if(Number(danMj)>=1 && Number(danMj)<=9) {
                    danMj = "0" + danMj;
                }
                datum += danMj + ".";
                var m = mjesec + 1;
                if(m>=1 && m<=9) {
                    m="0"+m;
                }
                datum+= m + ".";
                datum+=(new Date()).getFullYear();
            }
           
            Pozivi.spasiTermine(dan,periodicna.checked,datum,semestar,pocetak,kraj,sala,osoblje,div);
        }
        else {
            return;
        }
    }
}